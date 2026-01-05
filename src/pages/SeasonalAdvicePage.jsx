/**
 * @file SeasonalAdvicePage.jsx
 * @description This file belongs to the Seasonal Advice module. It's the main page component.
 * It manages the state for the selected crop, month, filters, and orchestrates the child components.
 * TODO: Replace mock loading with actual data fetching from a backend.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OpenRouter } from "@openrouter/sdk";
import { MONTHS } from '../utils/seasonUtils';
import { SEASONAL_DATA } from '../data/seasonal';
import SeasonSidebar from '../components/SeasonSidebar';
import SeasonalCalendar from '../components/SeasonalCalendar';
import FormattedAdvice from '../components/FormattedAdvice';

const SeasonalAdvicePage = () => {
  const { t, i18n } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [pin, setPin] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetAdvice = useCallback(async () => {
    if (!selectedCrop) {
      setError(t('seasonal.error.no_crop'));
      return;
    }
    if (pin.length !== 6) {
      setError(t('seasonal.error.invalid_pin'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setAdvice('');

    try {
      const openrouter = new OpenRouter({
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY_SEASONAL,
      });

      const stream = await openrouter.chat.send({
        model: "openai/gpt-4o-mini-search-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert agricultural advisor.

This prompt is used ONLY for the Seasonal Farming Advice section.

Your goal is to produce output that is:
- Extremely easy to read
- Farmer-friendly
- Mobile-screen optimized
- Visually clean and engaging
- NOT boring or text-heavy

--------------------------------------------------

GLOBAL OUTPUT RULES (VERY STRICT):

1. NEVER produce a single long paragraph.
2. NEVER dump all information together.
3. Each idea must be separated clearly.
4. Use short sentences only.
5. Emojis are ALLOWED and ENCOURAGED, but use them smartly.
6. Do NOT use markdown symbols like ** ### ---.
7. Do NOT sound like a textbook or research article.
8. Output should feel like a friendly expert guiding the farmer step-by-step.

--------------------------------------------------

OUTPUT VISUAL STYLE (IMPORTANT):

- Think like WhatsApp-style guidance
- Think like Instagram carousel text
- Think like a field expert talking calmly

--------------------------------------------------

MANDATORY OUTPUT STRUCTURE (FOLLOW EXACTLY):

LINE 1 (HEADER):
🌱 Crop Name | District, State | Month

LINE 2 (ONE-LINE SUMMARY):
Why this month is good or risky for this crop (1 short line only).

--------------------------------------------------

SECTION 1: 🌦️ Weather Check
- 2 short lines max
- Mention temperature and rainfall feel (not numbers heavy)
- Say clearly: Good / Average / Risky

--------------------------------------------------

SECTION 2: 🌾 What To Do This Month
(Only ACTIONS, no theory)

1️⃣ Soil work (1 short line)
2️⃣ Seed or plant choice (1 short line)
3️⃣ Sowing or transplant timing (1 short line)

--------------------------------------------------

SECTION 3: 💧 Water & Nutrition
- Irrigation frequency in simple words
- Fertilizer advice in plain language
- Avoid numbers unless very necessary

--------------------------------------------------

SECTION 4: 🐛 Watch Out For
- Name 1–2 common problems
- 1 symptom farmers can easily recognize
- 1 simple control step

--------------------------------------------------

SECTION 5: 🌿 Daily Care Tips
- 3 bullet-style short tips
- Things farmer should check daily/weekly

--------------------------------------------------

SECTION 6: 🌾 Harvest & Storage (If applicable)
- When to harvest (visible sign)
- One storage tip

--------------------------------------------------

SECTION 7: ⭐ Expert Advice (MOST IMPORTANT)
Write this like a senior farmer talking.

Rules:
- 3 short lines only
- Warn about 1 common mistake
- Give 1 smart tip for better yield
- End with reassurance

Example tone:
“जास्त पाणी देणे टाळा. वेळेवर निरीक्षण केल्यास नुकसान टळते. साधी काळजी मोठा फायदा देते.”

--------------------------------------------------

LANGUAGE RULES:
- Detect user language automatically.
- Respond ONLY in the same language.
- Keep tone warm, practical, and human.

--------------------------------------------------

FINAL SELF-CHECK BEFORE ANSWERING:
- Can this be read comfortably on a phone?
- Can a farmer understand it in 30 seconds?
- Does it feel friendly, not boring?

If YES, respond.`,
          },
          {
            role: "user",
            content: `Crop: ${selectedCrop.name}, PIN Code: ${pin}, Month: ${selectedMonth}, Language: ${i18n.language}`,
          },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          setAdvice((prevAdvice) => prevAdvice + content);
        }
      }
    } catch (err) {
      setError(err.message || t('seasonal.error.unexpected'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedCrop, selectedMonth, pin, t]);

  const handleStartOver = () => {
    setAdvice(null);
    setError(null);
    setSelectedCrop(null);
    setPin('');
  };

  
    return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-900 text-white rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-green-400">{t('seasonal.title')}</h1>
        <p className="text-gray-400 mt-2">{t('seasonal.subtitle')}</p>
      </header>

      <div>
        {advice ? (
          // Output View
          <div>
            <div className="text-center mb-6">
              <button 
                onClick={handleStartOver}
                className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t('seasonal.start_over')}
              </button>
              <h2 className="text-2xl font-bold">{t('seasonal.advice_for', { cropName: selectedCrop.name, month: selectedMonth })}</h2>
              <p className="text-gray-400">{t('seasonal.location_pin', { pin })}</p>
            </div>
            <FormattedAdvice text={advice} />
          </div>
        ) : (
          // Input View
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <aside className="w-full lg:w-1/3 lg:max-w-md mb-8 lg:mb-0">
              <SeasonSidebar
                crops={SEASONAL_DATA.crops}
                selectedCrop={selectedCrop}
                onSelectCrop={setSelectedCrop}
                pin={pin}
                onPinChange={setPin}
                isLoading={isLoading}
                onGetAdvice={handleGetAdvice}
              />
            </aside>
            <main className="w-full lg:w-2/3">
              <SeasonalCalendar
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
              />
              <div className="mt-6 text-center p-4 bg-gray-800 rounded-lg">
                {error && <div className="text-red-500 mb-4">{t('seasonal.error.prefix')} {error}</div>}
                <p className="text-gray-400">{t('seasonal.prompt.select_all')}</p>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonalAdvicePage;
