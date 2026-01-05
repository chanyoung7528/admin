import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@shared/lib/utils';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, icons, type LucideIcon, X } from 'lucide-react';

import type { QuickMenuItem as QuickMenuItemType } from './types';

interface QuickMenuItemProps {
  item: QuickMenuItemType;
  isEditMode: boolean;
  onDelete: (id: string) => void;
  onClick?: (item: QuickMenuItemType) => void;
  onLongPressStart?: () => void;
  onLongPressCancel?: () => void;
}

export function QuickMenuItem({
  item,
  isEditMode,
  onDelete,
  onClick,
  onLongPressStart: _onLongPressStart,
  onLongPressCancel: _onLongPressCancel,
}: QuickMenuItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  // 아이콘 동적 가져오기
  const IconComponent: LucideIcon = (icons as Record<string, LucideIcon>)[item.icon] || Bookmark;

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      return;
    }
    onClick?.(item);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      layout
      layoutId={item.id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDragging ? 1.08 : 1,
        opacity: isDragging ? 0.8 : 1,
        rotate: isEditMode && !isDragging ? [0, -1.5, 1.5, -1.5, 0] : isDragging ? 3 : 0,
        y: isDragging ? -8 : 0,
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        mass: 0.8,
        rotate: {
          repeat: isEditMode && !isDragging ? Infinity : 0,
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        },
        y: {
          type: 'spring',
          stiffness: 300,
          damping: 25,
        },
      }}
      whileTap={isEditMode ? {} : { scale: 0.92, transition: { duration: 0.1 } }}
      whileHover={!isDragging && !isEditMode ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      onClick={handleClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-shadow duration-200',
        isDragging ? 'cursor-grabbing shadow-2xl' : isEditMode ? 'cursor-grab shadow-lg' : 'cursor-pointer shadow-md hover:shadow-lg'
      )}
      style={{
        ...style,
        backgroundColor: item.color || '#f3f4f6',
        touchAction: isEditMode ? 'none' : 'auto',
      }}
    >
      {/* 삭제 버튼 (편집 모드) */}
      {isEditMode && (
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20,
          }}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDeleteClick}
          className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
        >
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {/* 아이콘 */}
      <motion.div
        animate={{
          scale: isEditMode ? [1, 1.08, 1] : 1,
          rotate: isDragging ? [0, -5, 5, -5, 0] : 0,
        }}
        transition={{
          scale: {
            repeat: isEditMode ? Infinity : 0,
            duration: 1.2,
            ease: [0.4, 0, 0.6, 1],
          },
          rotate: {
            repeat: isDragging ? Infinity : 0,
            duration: 0.3,
          },
        }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm"
      >
        <IconComponent className="h-6 w-6 text-gray-700" />
      </motion.div>

      {/* 제목 */}
      <span className="line-clamp-2 text-center text-xs font-medium text-gray-800">{item.title}</span>

      {/* 북마크 표시 */}
      {!isEditMode && item.order < 4 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: 0.1,
          }}
          className="absolute -top-1 -right-1"
        >
          <BookmarkCheck className="h-4 w-4 text-blue-500 drop-shadow-md" />
        </motion.div>
      )}
    </motion.div>
  );
}
