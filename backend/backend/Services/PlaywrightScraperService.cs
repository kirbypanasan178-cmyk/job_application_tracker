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

    // browser - the actual browser process
    // context - a separate browser session/profile
    // page = a tab inside that session
    public async Task<string> GetCleanVisibleTextAsync(string url)
    {
        // create an object that represents the Playwright automation system
        using var playwright = await Playwright.CreateAsync();
        // launch the chromium 
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true // run the browser without showing the browser window
        });
        // create a browser context, a separate browser session/profile
        var context = await browser.NewContextAsync(new BrowserNewContextOptions
        {
            // a browser sends info to website what kind of browser is making the request
            UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" // 
        });
        // this creates a browser tab
        var page = await context.NewPageAsync();
        // this doesnt interact with the website, it's just for application's logs
        _logger.LogInformation("Navigating to {Url}", url);
        // this one navigate to website
        await page.GotoAsync(url, new PageGotoOptions
        {
            WaitUntil = WaitUntilState.DOMContentLoaded,  // "When should you consider navigation ready enough for GotoAsync() to finish?"
            Timeout = 45000                                 // "How long are you allowed to wait before giving up?"
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