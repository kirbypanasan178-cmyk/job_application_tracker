using System.Text;
using System.Text.Json;
using backend.Models;

namespace backend.Services
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<GeminiService> _logger;
        private readonly string _apiKey;
        private readonly string _model;

        public GeminiService(HttpClient httpClient, IConfiguration config, ILogger<GeminiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = config["Gemini:ApiKey"]
                      ?? throw new InvalidOperationException("Gemini:ApiKey is not configured");
            _model = config["Gemini:Model"] ?? "gemini-2.0-flash";
        }

        public async Task<ExtractedJobDto> ExtractJobDataAsync(string cleanedText, string sourceUrl)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new object[]
                {
                    new
                    {
                        role = "user",
                        parts = new object[]
                        {
                            new
                            {
                                text = $"""
                                    Extract structured data from this job posting's visible page text.
                                    Use null for anything not present. employmentType should be one of:
                                    FullTime, PartTime, Contract, Internship, Temporary (best guess if unclear).
                                    workSetupType should be one of: Remote, Hybrid, OnSite (best guess if unclear).

                                    Source URL: {sourceUrl}

                                    --- PAGE TEXT START ---
                                    {cleanedText}
                                    --- PAGE TEXT END ---
                                    """
                            }
                        }
                    }
                },
                generationConfig = new
                {
                    responseMimeType = "application/json",
                    responseSchema = new
                    {
                        type = "OBJECT",
                        properties = new
                        {
                            companyName = new { type = "STRING" },
                            jobTitle = new { type = "STRING" },
                            location = new { type = "STRING" },
                            description = new { type = "STRING" },
                            requirements = new { type = "STRING" },
                            skills = new { type = "STRING" },
                            employmentType = new { type = "STRING" },
                            workSetupType = new { type = "STRING" },
                            salaryMin = new { type = "NUMBER" },
                            salaryMax = new { type = "NUMBER" }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);

            var maxRetries = 3;
            HttpResponseMessage? response = null;
            string responseBody = string.Empty;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                using var content = new StringContent(json, Encoding.UTF8, "application/json");
                response = await _httpClient.PostAsync(url, content);
                responseBody = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                    break;

                if (response.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable && attempt < maxRetries)
                {
                    _logger.LogWarning("Gemini returned 503, retrying ({Attempt}/{Max})...", attempt, maxRetries);
                    await Task.Delay(1000 * attempt);
                    continue;
                }

                _logger.LogError("Gemini API error {Status}: {Body}", response.StatusCode, responseBody);
                throw new HttpRequestException($"Gemini API returned {response.StatusCode}: {responseBody}");
            }

            using var doc = JsonDocument.Parse(responseBody);

            var extractedJsonText = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(extractedJsonText))
                throw new InvalidOperationException("Gemini returned an empty extraction result.");

            return JsonSerializer.Deserialize<ExtractedJobDto>(extractedJsonText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new ExtractedJobDto();
        }
    }
}