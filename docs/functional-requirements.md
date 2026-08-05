# Functional Requirements

## Purpose

The application is a single-page experience designed primarily for Black women ages 25–35. It uses current weather conditions in the Atlanta, Georgia metropolitan area to generate contemporary outfit suggestions and shopping links that feel polished, culturally aware, and relevant to daily life.

## Intended Audience

- The primary audience is Black women ages 25–35 living in or around metro Atlanta.
- The experience shall feel current, confident, sophisticated, and useful without treating age, race, body type, hair, lifestyle, or personal style as a stereotype.
- Recommendations shall reflect a range of everyday contexts, including work, errands, brunch, date nights, community events, travel, and casual social plans.
- The application shall not assume that all Black women share the same aesthetic, body shape, hair texture, budget, profession, or lifestyle.

## Functional Requirements

### FR-1: Single-Page Application

- The application shall operate as a single-page application without requiring a full-page navigation or reload.
- The application shall have two states within the same page: an initial start screen and a modal results experience displayed over the start screen.
- State changes shall occur within the SPA and shall not navigate the user to a separate route or browser page.
- The application shall be implemented in TypeScript.

### FR-2: Start Screen

- The initial start screen shall display the current Atlanta time, current Atlanta date, temperature, precipitation probability, humidity, wind speed, and one interactive element: a button labeled `Dress Me`.
- Current weather shall be the visual focal point of the start screen, with temperature as the most prominent value and precipitation, humidity, and wind presented as supporting metrics.
- The weather information shall appear above the `Dress Me` button in a clear visual hierarchy.
- Weather-change notes, outfit recommendations, retailer links, regeneration controls, navigation, explanatory copy, and footer content shall not appear on the initial start screen.
- The `Dress Me` button shall be fuchsia and shall maintain accessible contrast in its default, hover, focus, active, disabled, and loading states.
- The `Dress Me` button shall be keyboard accessible and shall have a visible focus indicator.
- Activating `Dress Me` shall initiate outfit generation using the latest available Atlanta weather data, then open the results in a Material UI `Modal` over the start screen.

### FR-3: Atlanta Weather and Time

- The home screen shall retrieve and display the current weather for the Atlanta, Georgia metropolitan area when the application loads.
- The home screen shall display the current temperature, precipitation probability, humidity, and wind speed.
- When any weather value returned by the API is `null`, `undefined`, missing, or otherwise unavailable, the corresponding displayed value shall be `-` rather than an inferred value, zero, `NaN`, or an empty space.
- The home screen shall display the current date and time for Atlanta using the `America/New_York` time zone.
- The current time shall update while the application remains open without requiring a page reload.
- The `Dress Me` button shall remain disabled until the initial Atlanta weather request succeeds.
- Weather and time data shall be refreshed often enough to remain current while the application is open.
- The home screen shall show a clear, accessible error state when current weather data cannot be retrieved and shall allow the user to retry.

### FR-4: Initial Outfit Generation

- The `Dress Me` button shall initiate the first outfit generation request using the latest available Atlanta weather data.
- When the user activates `Dress Me`, the button shall be replaced by, or transition into, a spinning loading icon while the outfit data is being prepared.
- The generation control shall not initiate duplicate requests while generation is in progress.
- The generated outfit shall be appropriate for the displayed Atlanta weather conditions and relevant to the intended audience.
- Recommendations shall balance contemporary style, comfort, versatility, and polish for Black women ages 25–35 without describing styles as "age appropriate" or imposing age-based restrictions.
- Outfit variety shall include casual, professional, elevated, and social looks rather than relying on one assumed style identity.
- The generated result shall use text and Material UI elements only and shall not display an outfit picture, model photograph, garment photograph, flat lay, clothing rack, or other outfit image.
- The result shall identify the recommended outfit items and provide at least one relevant external link for each item.
- Recommended item links shall come from a curated catalog of clothing retailers relevant to Black women ages 25–35.
- A retailer may qualify for the catalog through demonstrated representation of Black women, inclusive sizing, a contemporary assortment relevant to the intended audience, or Black ownership or leadership.
- The application shall not claim that a retailer is designed for or endorsed by all Black women unless that claim is supported by the retailer.
- Shopping recommendations shall include a variety of price points, styles, and size ranges and shall avoid assuming a single body type, fit preference, budget, or aesthetic.
- Each recommended item shall display the retailer name and link directly to the relevant product when available; otherwise, it shall link to a retailer search or category page for that item type.
- Retailer links shall use secure `https` destinations and shall be validated periodically to remove broken or irrelevant destinations.
- Outfit links shall clearly identify their destination and open without replacing the application page.
- If outfit generation fails, the application shall stop the loading animation, display a clear error message, and allow the user to try again.

### FR-5: Outfit Regeneration

- After an outfit has been generated, the application shall display a `Regenerate` button.
- The `Regenerate` button shall appear inside the results modal.
- Activating `Regenerate` shall generate and render a new outfit suggestion using the latest available Atlanta weather report.
- The `Regenerate` button shall use the same loading, duplicate-request prevention, and error behavior as the initial generation control.

### FR-6: Weather Change Notes

- The application shall display a small light-blue note section in the upper-right area of the results modal.
- The note section shall provide practical suggestions based on expected weather changes throughout the current day, such as changes in temperature, precipitation, wind, or severe conditions.
- When no meaningful weather change is expected, the note section shall communicate that conditions are expected to remain stable.
- The note content shall update when the weather data is refreshed.
- When relevant, weather notes shall include practical guidance for protecting hairstyles from rain, wind, or Atlanta humidity without assuming a specific hair texture or hairstyle.
- The note section shall remain readable and accessible on smaller screens, repositioning as needed to avoid covering other content.

### FR-7: Representation and Cultural Relevance

- The generated outfit experience shall not display pictures; representation shall be expressed through relevant recommendations, retailer selection, inclusive sizing, varied contexts, and respectful language.
- Outfit names and descriptions shall avoid caricatures, stereotypes, tokenism, fetishizing language, and assumptions based on race or age.
- Recommendations may reflect Atlanta's climate, social settings, and fashion culture while preserving variety and individual choice.
- The application shall use affirming, direct language and shall not frame the user's identity, age, body, or hair as a problem to correct.
- Generated suggestions shall vary across repeated requests so that the intended audience is represented through more than one aesthetic.

## User Interface and Theme Requirements

### UI-1: Material UI

- The application shall use Material UI components for all user-interface elements.
- The results popup shall use Material UI's `Modal` component as its modal foundation.
- Styling shall be implemented through the Material UI theme and Material UI styling APIs.
- Loading feedback shall use a Material UI progress indicator.

### UI-2: Theme Palette

The Material UI theme shall incorporate all of the following colors:

| Color | Hex value |
| --- | --- |
| Golden yellow | `#F7B720` |
| Chartreuse | `#D8CF00` |
| Orange | `#F35900` |
| Olive green | `#6D7636` |
| Dark olive | `#42421E` |

- The initial `Dress Me` button shall use a fuchsia color that is visually distinct from the theme palette.
- Text and controls shall maintain accessible color contrast in all states, including default, hover, focus, disabled, loading, success, and error states.

### UI-3: Visual Direction

- The interface shall feel editorial, contemporary, warm, and polished rather than juvenile or trend-dependent.
- Typography and styling shall support the intended audience without using culturally stereotyped patterns, symbols, slang, or decorative motifs.
- Outfit recommendations shall use typography, spacing, color, icons, dividers, and item metadata instead of pictures.

### UI-4: Results Modal

- After `Dress Me` completes, the application shall open a Material UI `Modal` containing the results without replacing or navigating away from the start screen.
- The results modal shall contain the weather-change note, styling brief, recommended items, retailer links, error feedback, `Regenerate` control, and weather refresh control.
- The modal shall have a visible close button with an accessible name.
- The modal shall close when the user activates its close button or presses `Escape`.
- Clicking the modal backdrop may close the modal, provided an in-progress generation or regeneration request is not interrupted without warning.
- Closing the modal shall return the user to the home screen and restore keyboard focus to `Dress Me`.
- While the modal is open, keyboard focus shall be trapped within it and the underlying start screen shall not be interactive.
- The modal shall expose an accessible name and description through appropriate ARIA relationships.
- The modal surface shall fit within the viewport and shall have a maximum height that leaves a visible backdrop around it on desktop.
- On smaller screens, the modal may occupy most of the viewport while preserving a visible close control and safe viewport spacing.
- When modal content exceeds the available height, the modal content area shall scroll vertically while the underlying page remains scroll-locked.
- Modal content shall follow a logical reading order and remain reachable through internal vertical scrolling and keyboard navigation.
- Neither the modal nor the underlying page shall introduce horizontal scrolling at supported desktop or mobile viewport widths.
- The modal's internal scroll position shall begin at the top when it first opens.
- Regenerating an outfit shall update the recommendation without unexpectedly resetting the modal's internal scroll position.
- Loading and error states initiated by `Dress Me` shall be presented accessibly, and an error shall not leave an empty modal.

## Acceptance Summary

The requirements are satisfied when a Black woman between ages 25 and 35 opens a home screen where the current Atlanta temperature is the focal point, supported by the current precipitation probability, humidity, wind speed, time, and date above a fuchsia `Dress Me` button, then activates that button and receives the results in an accessible, internally scrollable Material UI `Modal` without leaving or reloading the SPA. The modal must include practical weather-change guidance, a contemporary weather-appropriate text-only outfit recommendation, relevant retailer links, a `Regenerate` control, and a close control. Closing the modal must restore the home screen and return focus to `Dress Me`. No outfit picture shall appear in the generated result. The experience must provide respectful relevance without relying on racial, age, body, hair, budget, or lifestyle stereotypes. All interface elements and styling must use Material UI, and the application theme must include the five specified colors.