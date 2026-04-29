import type { Meta, StoryObj } from '@storybook/web-components';
import './aspect-ratio.js';

const meta: Meta = {
  title: 'Components/AspectRatio',
  component: 'elx-aspect-ratio',
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'text',
      description: 'Aspect ratio as number (1.77) or fraction string ("16/9")',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default16x9: Story = {
  render: () => `
    <elx-aspect-ratio>
      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" alt="Mountain landscape">
    </elx-aspect-ratio>
  `,
};

export const Ratio4x3: Story = {
  render: () => `
    <elx-aspect-ratio ratio="4/3">
      <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800" alt="Nature scene">
    </elx-aspect-ratio>
  `,
};

export const Square1x1: Story = {
  render: () => `
    <elx-aspect-ratio ratio="1/1">
      <img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800" alt="Cat portrait">
    </elx-aspect-ratio>
  `,
};

export const Portrait9x16: Story = {
  render: () => `
    <elx-aspect-ratio ratio="9/16">
      <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800" alt="Portrait photo">
    </elx-aspect-ratio>
  `,
};

export const Cinematic21x9: Story = {
  render: () => `
    <elx-aspect-ratio ratio="21/9">
      <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800" alt="Wide landscape">
    </elx-aspect-ratio>
  `,
};

export const CustomRatio: Story = {
  render: () => `
    <elx-aspect-ratio ratio="2.35">
      <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800" alt="Cinematic view">
    </elx-aspect-ratio>
  `,
};

export const WithVideo: Story = {
  render: () => `
    <elx-aspect-ratio ratio="16/9">
      <video controls style="width: 100%; height: 100%;">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </elx-aspect-ratio>
  `,
};

export const WithIframe: Story = {
  render: () => `
    <elx-aspect-ratio ratio="16/9">
      <iframe 
        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
        title="YouTube video player"
        style="width: 100%; height: 100%; border: none;"
        allowfullscreen>
      </iframe>
    </elx-aspect-ratio>
  `,
};

export const WithContent: Story = {
  render: () => `
    <elx-aspect-ratio ratio="16/9">
      <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
        Any Content
      </div>
    </elx-aspect-ratio>
  `,
};

export const CustomObjectFit: Story = {
  render: () => `
    <style>
      elx-aspect-ratio.contain {
        --elx-aspect-ratio-object-fit: contain;
        --elx-aspect-ratio-object-position: center;
        background: #f1f5f9;
      }
    </style>
    <elx-aspect-ratio class="contain" ratio="16/9">
      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" alt="Mountain landscape with contain fit">
    </elx-aspect-ratio>
  `,
};

export const ResponsiveGrid: Story = {
  render: () => `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
      <elx-aspect-ratio ratio="1/1">
        <img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400" alt="Image 1">
      </elx-aspect-ratio>
      <elx-aspect-ratio ratio="1/1">
        <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400" alt="Image 2">
      </elx-aspect-ratio>
      <elx-aspect-ratio ratio="1/1">
        <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400" alt="Image 3">
      </elx-aspect-ratio>
      <elx-aspect-ratio ratio="1/1">
        <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400" alt="Image 4">
      </elx-aspect-ratio>
    </div>
  `,
};
