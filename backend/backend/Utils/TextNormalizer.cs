using System.Text.RegularExpressions;

namespace backend.Utils
{
    public static class TextNormalizer
    {
        // Collapses newlines, tabs, repeated spaces, non-breaking spaces (\u00A0)
        // and zero-width spaces (\u200B) — both common in text copied from a
        // browser — into single regular spaces so words sit next to each other
        // separated by exactly one space.
        public static string NormalizeWhitespace(string? rawText)
        {
            if (string.IsNullOrWhiteSpace(rawText))
                return string.Empty;

            var collapsed = Regex.Replace(rawText, @"[\s\u00A0\u200B]+", " ");
            return collapsed.Trim();
        }
    }
}