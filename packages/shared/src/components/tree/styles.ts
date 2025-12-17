import { cva } from 'class-variance-authority';

// [스타일링 가이드 - Strapi 스타일 디자인]
export const treeVariants = cva(
  'group relative flex items-center gap-3 w-full px-3 text-sm cursor-pointer transition-all duration-200 border-t border-[#eaeaef] dark:border-neutral-700 pt-4 pb-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
);

export const selectedTreeVariants = cva('bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/20');

export const dragOverVariants = cva('bg-blue-100 dark:bg-blue-800/30 shadow-md');
