export * from "./auth";
export * from './messages';
export * from "./martketplace";
export * from "./properties";
export * from "./user";
export * from "./reviews";
export * from "./trends";



export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
};