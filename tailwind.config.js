/** @type {import('tailwindcss').Config} */
const content = [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`,
];

const darkMode = 'class';

export default {
    content,
    darkMode,
};
