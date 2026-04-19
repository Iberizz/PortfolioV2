export type StackItem = {
    name: string;
    version?: string;
    color: string;
    angle: number; // position en degrés sur l'orbite
    distance: number; // distance du hub en px
    icon: string; // SVG path ou emoji fallback
};