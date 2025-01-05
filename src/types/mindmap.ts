export type ColorTheme = 'rainbow' | 'ocean' | 'forest' | 'sunset' | 'grayscale';
export type BranchWidth = 'thin' | 'medium' | 'thick' | 'default';
export type FontFamily = 'default' | 'arial' | 'times' | 'courier';
export type LayoutType = 'basic' | 'simple-lines' | 'rounded-rect' | 'angled-lines' | 'stepped-lines' | 
                        'premium-rect' | 'premium-circle' | 'premium-rounded' | 'premium-floating';

export interface MindMapStyle {
  // Map Style
  autoBalance: boolean;
  compactMap: boolean;
  justifyTopicAlignment: boolean;
  
  // Advanced Layout
  branchFreePositioning: boolean;
  flexibleFloatingTopic: boolean;
  topicOverlap: boolean;
  
  // Theme
  colorTheme: ColorTheme;
  backgroundColor: string;
  globalFont: FontFamily;
  branchLineWidth: BranchWidth;
  branchColor: string;
  cjkFont: FontFamily;
  layout: LayoutType;
}

export interface StyleChanges {
  mapStyle?: Partial<MindMapStyle>;
  colorTheme?: ColorTheme;
}

export interface ThemePreset {
  id: ColorTheme;
  name: string;
  colors: string[];
  preview: string;
}
