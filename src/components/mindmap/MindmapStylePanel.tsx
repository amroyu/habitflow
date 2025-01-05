import React, { useState } from 'react';
import { Select, Switch, Popover } from 'antd';
import styled from '@emotion/styled';
import { MindMapStyle, StyleChanges, ColorTheme, LayoutType } from '@/types/mindmap';
import { ChevronDown } from 'lucide-react';

const StyledPanel = styled.div`
  width: 320px;
  height: 100%;
  overflow-y: auto;
  background: white;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;

  .tabs {
    display: flex;
    margin-bottom: 0;
    width: 100%;
    background: #fff;
  }

  .tab {
    flex: 1;
    padding: 16px 0;
    text-align: center;
    cursor: pointer;
    color: #8590a6;
    font-size: 14px;
    position: relative;
    border-bottom: 1px solid #e8e8e8;
    
    &.active {
      color: #1f1f1f;
      font-weight: 500;
      border-bottom: 2px solid #1f1f1f;
    }
  }

  .content {
    padding: 24px 16px;
    flex: 1;
    width: 100%;
  }

  .section {
    margin-bottom: 32px;
    background: #fff;
    border-radius: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-title {
    font-size: 14px;
    color: #8590a6;
    margin-bottom: 12px;
  }

  .select-container {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .icon {
      width: 20px;
      height: 20px;
      color: #8590a6;
    }

    .chevron {
      margin-left: auto;
      width: 16px;
      height: 16px;
      color: #8590a6;
    }
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 12px 0;
  }

  .theme-preview {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;

    &:hover {
      border-color: #1f1f1f;
    }

    &.active {
      border-color: #1f1f1f;
      background: rgba(0, 0, 0, 0.02);
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .color-picker-button {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all 0.2s;
    padding: 2px;
    background: #fff;

    &:hover {
      border-color: #1f1f1f;
    }

    .color-preview {
      width: 100%;
      height: 100%;
      border-radius: 2px;
    }
  }

  .option-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }

    .label {
      font-size: 14px;
      color: #1f1f1f;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &.locked {
      opacity: 0.5;
      cursor: not-allowed;

      .label {
        color: #8590a6;
      }
    }
  }

  .ant-select {
    width: 100%;
    
    .ant-select-selector {
      border-radius: 8px;
      height: 40px;
      padding: 0 12px;
      border: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      
      .ant-select-selection-item {
        line-height: 38px;
      }
    }
  }

  .help-text {
    font-size: 12px;
    color: #8590a6;
    margin-top: 8px;
    line-height: 1.5;
    font-weight: normal;
  }

  .layout-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .layout-item {
    aspect-ratio: 1.5;
    padding: 8px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &:hover {
      border-color: #1f1f1f;
      background: rgba(0, 0, 0, 0.02);
    }

    &.active {
      border-color: #1f1f1f;
      background: rgba(0, 0, 0, 0.02);
    }

    &.locked {
      opacity: 0.5;
      cursor: not-allowed;

      &:after {
        content: '';
        position: absolute;
        top: 8px;
        right: 8px;
        width: 16px;
        height: 16px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ff4d4f" stroke-width="2"><path d="M12 10v4M8 8V6a4 4 0 0 1 8 0v2M4 8h16v12H4z"/></svg>') center/contain no-repeat;
      }
    }

    &.premium {
      &:after {
        content: '';
        position: absolute;
        top: 8px;
        right: 8px;
        width: 16px;
        height: 16px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffd666" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>') center/contain no-repeat;
      }
    }
  }

  .layout-section {
    margin-bottom: 24px;
    
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #1f1f1f;
      }
    }
  }

  .layout-popup {
    width: 420px;
    background: #f5f5f5;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  .layout-header {
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #1f1f1f;
    }

    .chevron {
      width: 16px;
      height: 16px;
      color: #8590a6;
    }
  }

  .layout-sections {
    padding: 16px;

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: #1f1f1f;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;

      .chevron {
        width: 14px;
        height: 14px;
        color: #8590a6;
      }
    }
  }

  .layout-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 24px;
  }

  .layout-item {
    aspect-ratio: 1.5;
    padding: 12px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    background: white;

    &:hover {
      border-color: #1f1f1f;
      background: #fafafa;
    }

    &.active {
      border: 2px solid #1f1f1f;
      padding: 11px;
    }

    &.premium {
      &:after {
        content: '';
        position: absolute;
        top: 8px;
        right: 8px;
        width: 16px;
        height: 16px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ff4d4f" stroke-width="2"><path d="M12 10v4M8 8V6a4 4 0 0 1 8 0v2M4 8h16v12H4z"/></svg>') center/contain no-repeat;
      }
    }

    svg {
      width: 100%;
      height: 100%;
      
      rect, circle {
        fill: #e8e8e8;
      }
      
      path, line {
        stroke: #bfbfbf;
      }
    }
  }

  .select-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    margin-bottom: 24px;

    &:hover {
      border-color: #1f1f1f;
    }

    .icon {
      width: 20px;
      height: 20px;
      color: #8590a6;
    }

    .chevron {
      margin-left: auto;
      width: 16px;
      height: 16px;
      color: #8590a6;
    }
  }
`;

const StylePanelContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  color: #666;
  font-size: 14px;
  margin: 0;
`;

const ThemePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
`;

interface ThemePreviewProps {
  selected?: boolean;
}

const ThemePreview = styled.div<ThemePreviewProps>`
  border: 2px solid ${(props: ThemePreviewProps) => props.selected ? '#4299E1' : '#eee'};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4299E1;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ColorThemeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

interface TabProps {
  active?: boolean;
}

const TabsContainer = styled.div`
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
`;

const Tab = styled.div<TabProps>`
  padding: 8px 16px;
  cursor: pointer;
  color: ${(props: TabProps) => props.active ? '#000' : '#666'};
  border-bottom: 2px solid ${(props: TabProps) => props.active ? '#000' : 'transparent'};
`;

const CustomThemeButton = styled.button`
  width: 100%;
  padding: 12px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

interface MindmapStylePanelProps {
  style: MindMapStyle;
  onStyleChange: (changes: StyleChanges) => void;
}

const themePresets = [
  {
    id: 'rainbow',
    name: 'Rainbow',
    colors: ['#ff4d4f', '#ffa940', '#fadb14', '#52c41a', '#1890ff', '#722ed1'],
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="80" y="45" width="40" height="30" rx="4" fill="#1f1f1f"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#ff4d4f"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#ffa940"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#52c41a"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#722ed1"/>
        <path d="M55 32.5H80" stroke="#ff4d4f" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#ffa940" strokeWidth="2"/>
        <path d="M55 87.5H80" stroke="#52c41a" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#722ed1" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#13c2c2', '#36cfc9', '#5cdbd3', '#87e8de', '#b5f5ec', '#e6fffb'],
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="80" y="45" width="40" height="30" rx="4" fill="#13c2c2"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#36cfc9"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#5cdbd3"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#87e8de"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#b5f5ec"/>
        <path d="M55 32.5H80" stroke="#36cfc9" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#5cdbd3" strokeWidth="2"/>
        <path d="M55 87.5H80" stroke="#87e8de" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#b5f5ec" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#389e0d', '#52c41a', '#73d13d', '#95de64', '#b7eb8f', '#d9f7be'],
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="80" y="45" width="40" height="30" rx="4" fill="#389e0d"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#52c41a"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#73d13d"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#95de64"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#b7eb8f"/>
        <path d="M55 32.5H80" stroke="#52c41a" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#73d13d" strokeWidth="2"/>
        <path d="M55 87.5H80" stroke="#95de64" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#b7eb8f" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#d4380d', '#f5222d', '#fa541c', '#fa8c16', '#ffa940', '#ffd666'],
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="80" y="45" width="40" height="30" rx="4" fill="#d4380d"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#f5222d"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#fa541c"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#fa8c16"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#ffa940"/>
        <path d="M55 32.5H80" stroke="#f5222d" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#fa541c" strokeWidth="2"/>
        <path d="M55 87.5H80" stroke="#fa8c16" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#ffa940" strokeWidth="2"/>
      </svg>
    )
  }
];

const layoutPresets = [
  {
    id: 'basic',
    name: 'Basic Mind Map',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <path d="M55 32.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M55 87.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'simple-lines',
    name: 'Simple Lines',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="0" fill="#e8e8e8"/>
        <line x1="20" y1="32.5" x2="70" y2="32.5" stroke="#e8e8e8" strokeWidth="1"/>
        <line x1="130" y1="32.5" x2="180" y2="32.5" stroke="#e8e8e8" strokeWidth="1"/>
        <line x1="20" y1="87.5" x2="70" y2="87.5" stroke="#e8e8e8" strokeWidth="1"/>
        <line x1="130" y1="87.5" x2="180" y2="87.5" stroke="#e8e8e8" strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: 'rounded-rect',
    name: 'Rounded Rectangle',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <path d="M55 32.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M55 87.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'angled-lines',
    name: 'Angled Lines',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <path d="M55 32.5L70 45" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 45L145 32.5" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M55 87.5L70 75" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 75L145 87.5" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'stepped-lines',
    name: 'Stepped Lines',
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <path d="M55 32.5H62.5V45H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 45H137.5V32.5H145" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M55 87.5H62.5V75H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 75H137.5V87.5H145" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'premium-rect',
    name: 'Premium Rectangle',
    premium: true,
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <path d="M55 32.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M55 87.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'premium-circle',
    name: 'Premium Circle',
    premium: true,
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <circle cx="100" cy="60" r="20" fill="#e8e8e8"/>
        <circle cx="37.5" cy="32.5" r="15" fill="#e8e8e8"/>
        <circle cx="162.5" cy="32.5" r="15" fill="#e8e8e8"/>
        <circle cx="37.5" cy="87.5" r="15" fill="#e8e8e8"/>
        <circle cx="162.5" cy="87.5" r="15" fill="#e8e8e8"/>
        <path d="M52.5 32.5H80" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 32.5H147.5" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M52.5 87.5H80" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 87.5H147.5" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'premium-rounded',
    name: 'Premium Rounded',
    premium: true,
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="15" fill="#e8e8e8"/>
        <rect x="20" y="20" width="35" height="25" rx="12.5" fill="#e8e8e8"/>
        <rect x="145" y="20" width="35" height="25" rx="12.5" fill="#e8e8e8"/>
        <rect x="20" y="75" width="35" height="25" rx="12.5" fill="#e8e8e8"/>
        <rect x="145" y="75" width="35" height="25" rx="12.5" fill="#e8e8e8"/>
        <path d="M55 32.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 32.5H145" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M55 87.5H70" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 87.5H145" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'premium-floating',
    name: 'Premium Floating',
    premium: true,
    preview: (
      <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="white"/>
        <rect x="70" y="45" width="60" height="30" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="20" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="20" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <rect x="145" y="75" width="35" height="25" rx="4" fill="#e8e8e8"/>
        <path d="M55 32.5C62.5 32.5 62.5 45 70 45" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 45C137.5 45 137.5 32.5 145 32.5" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M55 87.5C62.5 87.5 62.5 75 70 75" stroke="#e8e8e8" strokeWidth="2"/>
        <path d="M120 75C137.5 75 137.5 87.5 145 87.5" stroke="#e8e8e8" strokeWidth="2"/>
      </svg>
    )
  }
];

const MindmapStylePanel: React.FC<MindmapStylePanelProps> = ({ style, onStyleChange }) => {
  const [activeTab, setActiveTab] = useState<'style' | 'pitch' | 'map'>('map');
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(style.colorTheme);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(style.layout);

  const handleThemeChange = (themeId: ColorTheme) => {
    setSelectedTheme(themeId);
    onStyleChange({ mapStyle: { colorTheme: themeId } });
  };

  const handleLayoutChange = (layoutId: LayoutType) => {
    if (!layoutId.startsWith('premium')) {
      setSelectedLayout(layoutId);
      onStyleChange({ mapStyle: { layout: layoutId } });
    }
  };

  const layoutContent = (
    <div className="layout-popup">
      <div className="layout-header">
        <h3>Mind Map</h3>
        <ChevronDown className="chevron" />
      </div>
      <div className="layout-sections">
        <div className="section-title">
          Mind Map
          <ChevronDown className="chevron" />
        </div>
        <div className="layout-grid">
          {layoutPresets.slice(0, 6).map((layout) => (
            <div
              key={layout.id}
              className={`layout-item ${selectedLayout === layout.id ? 'active' : ''} ${layout.premium ? 'premium' : ''}`}
              onClick={() => handleLayoutChange(layout.id as LayoutType)}
            >
              {layout.preview}
            </div>
          ))}
        </div>
        <div className="section-title">
          Logic Chart
          <ChevronDown className="chevron" />
        </div>
        <div className="layout-grid">
          {layoutPresets.slice(6).map((layout) => (
            <div
              key={layout.id}
              className={`layout-item ${selectedLayout === layout.id ? 'active' : ''} ${layout.premium ? 'premium' : ''}`}
              onClick={() => handleLayoutChange(layout.id as LayoutType)}
            >
              {layout.preview}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <StyledPanel>
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </div>
        <div 
          className={`tab ${activeTab === 'pitch' ? 'active' : ''}`}
          onClick={() => setActiveTab('pitch')}
        >
          Pitch
        </div>
        <div 
          className={`tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Map
        </div>
      </div>

      <div className="content">
        {activeTab === 'map' && (
          <>
            <div className="section">
              <Popover
                content={layoutContent}
                trigger="click"
                placement="bottomLeft"
                overlayStyle={{ padding: 0 }}
              >
                <div className="select-container">
                  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v12M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Mind Map
                  <ChevronDown className="chevron" />
                </div>
              </Popover>
            </div>

            <div className="section">
              <div className="section-title">Color Theme</div>
              <div className="select-container">
                <div style={{ 
                  width: 120, 
                  height: 12, 
                  background: `linear-gradient(to right, ${themePresets.find(t => t.id === selectedTheme)?.colors.join(', ')})`,
                  borderRadius: 6 
                }} />
                {themePresets.find(t => t.id === selectedTheme)?.name}
              </div>

              <div className="theme-grid">
                {themePresets.map((theme) => (
                  <div 
                    key={theme.id}
                    className={`theme-preview ${selectedTheme === theme.id ? 'active' : ''}`}
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    {theme.preview}
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="section-title">Background Color</div>
              <div className="color-picker-button">
                <div className="color-preview" style={{ background: style.backgroundColor }} />
              </div>
            </div>

            <div className="section">
              <div className="section-title">Global Font</div>
              <Select 
                value={style.globalFont}
                onChange={(value: string) => onStyleChange({ mapStyle: { globalFont: value } })}
              >
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="arial">Arial</Select.Option>
                <Select.Option value="times">Times New Roman</Select.Option>
                <Select.Option value="helvetica">Helvetica</Select.Option>
              </Select>
            </div>

            <div className="section">
              <div className="section-title">Branch Line Width</div>
              <Select 
                value={style.branchLineWidth}
                onChange={(value: string) => onStyleChange({ mapStyle: { branchLineWidth: value } })}
              >
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="thin">Thin</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="thick">Thick</Select.Option>
              </Select>
            </div>

            <div className="section">
              <div className="option-row">
                <span className="label">Colored Branch</span>
                <div className="color-picker-button">
                  <div className="color-preview" style={{ background: style.branchColor }} />
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-title">Map Style</div>
              <div className="option-row">
                <span className="label">Auto Balance Map</span>
                <Switch 
                  checked={style.autoBalance}
                  onChange={(checked) => onStyleChange({ mapStyle: { autoBalance: checked } })}
                />
              </div>
              <div className="option-row">
                <span className="label">Compact Map</span>
                <Switch 
                  checked={style.compactMap}
                  onChange={(checked) => onStyleChange({ mapStyle: { compactMap: checked } })}
                />
              </div>
              <div className="option-row">
                <span className="label">Justify Topic Alignment</span>
                <Switch 
                  checked={style.justifyTopicAlignment}
                  onChange={(checked) => onStyleChange({ mapStyle: { justifyTopicAlignment: checked } })}
                />
              </div>
            </div>

            <div className="section">
              <div className="section-title">Advanced Layout</div>
              <div className="option-row">
                <span className="label">Branch Free-Positioning</span>
                <Switch 
                  checked={style.branchFreePositioning}
                  onChange={(checked) => onStyleChange({ mapStyle: { branchFreePositioning: checked } })}
                />
              </div>
              <div className="option-row">
                <span className="label">Flexible Floating Topic</span>
                <Switch 
                  checked={style.flexibleFloatingTopic}
                  onChange={(checked) => onStyleChange({ mapStyle: { flexibleFloatingTopic: checked } })}
                />
              </div>
              <div className="option-row">
                <span className="label">Topic Overlap</span>
                <Switch 
                  checked={style.topicOverlap}
                  onChange={(checked) => onStyleChange({ mapStyle: { topicOverlap: checked } })}
                />
              </div>
            </div>

            <div className="section">
              <div className="section-title">CJK Font</div>
              <Select 
                value={style.cjkFont}
                onChange={(value: string) => onStyleChange({ mapStyle: { cjkFont: value } })}
                style={{ width: '100%' }}
              >
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="noto-sans">Noto Sans CJK</Select.Option>
                <Select.Option value="source-han">Source Han Sans</Select.Option>
              </Select>
              <div className="help-text">
                After setting Chinese, Japanese and Korean fonts, mixed layout with western typeface displays better.
              </div>
            </div>

            <CustomThemeButton>Custom Themes</CustomThemeButton>
          </>
        )}
      </div>
    </StyledPanel>
  );
};

export default MindmapStylePanel;
