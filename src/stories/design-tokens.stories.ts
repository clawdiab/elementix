import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '../theme.css';

const meta: Meta = {
  title: 'Design Tokens',
};
export default meta;

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */
const sectionStyle = `
  font-family: var(--elx-font-family-sans);
  color: var(--elx-color-neutral-800);
`;

const headingStyle = `
  font-size: var(--elx-font-size-xl);
  font-weight: var(--elx-font-weight-bold);
  margin: 0 0 12px;
`;

const subheadingStyle = `
  font-size: var(--elx-font-size-base);
  font-weight: var(--elx-font-weight-semibold);
  margin: 24px 0 8px;
  text-transform: capitalize;
`;

const gridStyle = `
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const swatchBoxStyle = (cssVar: string) => `
  width: 72px;
  height: 72px;
  border-radius: var(--elx-radius-md);
  background: var(${cssVar});
  box-shadow: 0 1px 3px rgba(0,0,0,.12);
`;

const swatchLabelStyle = `
  font-size: var(--elx-font-size-xs);
  color: var(--elx-color-neutral-500);
  margin-top: 4px;
  text-align: center;
  max-width: 72px;
  word-break: break-all;
`;

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */
const colorPalettes: Record<string, string[]> = {
  primary: ['50', '100', '500', '600', '700'],
  danger: ['50', '500', '600', '700'],
  success: ['50', '500', '600', '700'],
  warning: ['50', '100', '500', '600', '700'],
  purple: ['50', '100', '500', '600', '700'],
  neutral: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
};

const extraColors = ['--elx-color-white', '--elx-color-black'];

export const Colors: StoryObj = {
  render: () => html`
    <div style="${sectionStyle}">
      <p style="${headingStyle}">Color Tokens</p>

      ${Object.entries(colorPalettes).map(
        ([name, shades]) => html`
          <p style="${subheadingStyle}">${name}</p>
          <div style="${gridStyle}">
            ${shades.map((shade) => {
              const cssVar = `--elx-color-${name}-${shade}`;
              return html`
                <div>
                  <div style="${swatchBoxStyle(cssVar)}"></div>
                  <div style="${swatchLabelStyle}">${shade}</div>
                  <div style="${swatchLabelStyle}">var(${cssVar})</div>
                </div>
              `;
            })}
          </div>
        `,
      )}

      <p style="${subheadingStyle}">White &amp; Black</p>
      <div style="${gridStyle}">
        ${extraColors.map(
          (cssVar) => html`
            <div>
              <div
                style="${swatchBoxStyle(cssVar)} border: 1px solid var(--elx-color-neutral-200);"
              ></div>
              <div style="${swatchLabelStyle}">var(${cssVar})</div>
            </div>
          `,
        )}
      </div>
    </div>
  `,
};

/* ------------------------------------------------------------------ */
/*  Typography                                                         */
/* ------------------------------------------------------------------ */
const fontSizes = [
  { token: '--elx-font-size-xs', label: 'xs (12px)' },
  { token: '--elx-font-size-sm', label: 'sm (14px)' },
  { token: '--elx-font-size-base', label: 'base (16px)' },
  { token: '--elx-font-size-lg', label: 'lg (18px)' },
  { token: '--elx-font-size-xl', label: 'xl (20px)' },
  { token: '--elx-font-size-2xl', label: '2xl (24px)' },
  { token: '--elx-font-size-3xl', label: '3xl (30px)' },
  { token: '--elx-font-size-4xl', label: '4xl (36px)' },
];

const fontWeights = [
  { token: '--elx-font-weight-normal', label: 'normal (400)' },
  { token: '--elx-font-weight-medium', label: 'medium (500)' },
  { token: '--elx-font-weight-semibold', label: 'semibold (600)' },
  { token: '--elx-font-weight-bold', label: 'bold (700)' },
];

const lineHeights = [
  { token: '--elx-line-height-tight', label: 'tight (1.25)' },
  { token: '--elx-line-height-snug', label: 'snug (1.375)' },
  { token: '--elx-line-height-normal', label: 'normal (1.5)' },
  { token: '--elx-line-height-relaxed', label: 'relaxed (1.625)' },
];

const rowStyle = `
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid var(--elx-color-neutral-100);
`;

const tokenLabelStyle = `
  flex: 0 0 260px;
  font-size: var(--elx-font-size-sm);
  color: var(--elx-color-neutral-400);
  font-family: var(--elx-font-family-mono);
`;

export const Typography: StoryObj = {
  render: () => html`
    <div style="${sectionStyle}">
      <p style="${headingStyle}">Typography Tokens</p>

      <!-- Font Families -->
      <p style="${subheadingStyle}">Font Families</p>
      <div style="${rowStyle}">
        <span style="${tokenLabelStyle}">--elx-font-family-sans</span>
        <span style="font-family: var(--elx-font-family-sans); font-size: var(--elx-font-size-lg);">
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
      <div style="${rowStyle}">
        <span style="${tokenLabelStyle}">--elx-font-family-mono</span>
        <span style="font-family: var(--elx-font-family-mono); font-size: var(--elx-font-size-lg);">
          The quick brown fox jumps over the lazy dog
        </span>
      </div>

      <!-- Font Sizes -->
      <p style="${subheadingStyle}">Font Sizes</p>
      ${fontSizes.map(
        ({ token, label }) => html`
          <div style="${rowStyle}">
            <span style="${tokenLabelStyle}">${token} — ${label}</span>
            <span style="font-size: var(${token}); font-family: var(--elx-font-family-sans);">
              The quick brown fox
            </span>
          </div>
        `,
      )}

      <!-- Font Weights -->
      <p style="${subheadingStyle}">Font Weights</p>
      ${fontWeights.map(
        ({ token, label }) => html`
          <div style="${rowStyle}">
            <span style="${tokenLabelStyle}">${token} — ${label}</span>
            <span
              style="font-weight: var(${token}); font-size: var(--elx-font-size-lg); font-family: var(--elx-font-family-sans);"
            >
              The quick brown fox
            </span>
          </div>
        `,
      )}

      <!-- Line Heights -->
      <p style="${subheadingStyle}">Line Heights</p>
      ${lineHeights.map(
        ({ token, label }) => html`
          <div style="${rowStyle}">
            <span style="${tokenLabelStyle}">${token} — ${label}</span>
            <span
              style="line-height: var(${token}); font-size: var(--elx-font-size-base); font-family: var(--elx-font-family-sans); background: var(--elx-color-primary-50); padding: 4px 8px; border-radius: var(--elx-radius-sm);"
            >
              Line height sample<br />Second line of text
            </span>
          </div>
        `,
      )}
    </div>
  `,
};

/* ------------------------------------------------------------------ */
/*  Border Radius                                                      */
/* ------------------------------------------------------------------ */
const radii = [
  { token: '--elx-radius-sm', label: 'sm (0.125rem)' },
  { token: '--elx-radius-md', label: 'md (0.375rem)' },
  { token: '--elx-radius-lg', label: 'lg (0.5rem)' },
  { token: '--elx-radius-full', label: 'full (9999px)' },
];

export const BorderRadius: StoryObj = {
  render: () => html`
    <div style="${sectionStyle}">
      <p style="${headingStyle}">Border Radius Tokens</p>
      <div style="${gridStyle}">
        ${radii.map(
          ({ token, label }) => html`
            <div style="text-align: center;">
              <div
                style="
                width: 96px;
                height: 96px;
                background: var(--elx-color-primary-500);
                border-radius: var(${token});
                box-shadow: 0 1px 3px rgba(0,0,0,.12);
              "
              ></div>
              <div
                style="font-size: var(--elx-font-size-sm); font-weight: var(--elx-font-weight-semibold); margin-top: 8px;"
              >
                ${label}
              </div>
              <div style="${swatchLabelStyle} max-width: 96px;">var(${token})</div>
            </div>
          `,
        )}
      </div>
    </div>
  `,
};
