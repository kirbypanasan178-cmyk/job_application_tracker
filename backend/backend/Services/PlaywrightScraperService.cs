using Microsoft.Playwright;
using System.Text.RegularExpressions;

namespace  backend.Services;

public class PlaywrightScraperService : IScraperService
{
    private readonly ILogger<PlaywrightScraperService> _logger;

    public PlaywrightScraperService(ILogger<PlaywrightScraperService> logger)
    {
        _logger = logger;
    }

    public async Task<string> GetCleanVisibleTextAsync(string url)
    {
        using var playwright = await Playwright.CreateAsync();

        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true
        });

        var context = await browser.NewContextAsync(new BrowserNewContextOptions
        {
            UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        });

        var page = await context.NewPageAsync();

        _logger.LogInformation("Navigating to {Url}", url);

        await page.GotoAsync(url, new PageGotoOptions
        {
            WaitUntil = WaitUntilState.DOMContentLoaded,  // was NetworkIdle
            Timeout = 45000                                 // was 30000
        });

        // Give lazy-loaded / JS-rendered job boards a moment to settle.
        await page.WaitForTimeoutAsync(1500);

        // innerText only returns what's actually visible/rendered.
        var bodyText = await page.EvaluateAsync<string>("() => document.body.innerText");

        return CleanText(bodyText);
    }

    private static string CleanText(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return string.Empty;

        var text = Regex.Replace(raw, @"[ \t]+", " ");
        text = Regex.Replace(text, @"\n{3,}", "\n\n");
        text = text.Trim();

        const int maxChars = 20000;
        if (text.Length > maxChars)
            text = text[..maxChars];

        return text;
    }
}