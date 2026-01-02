import { useState } from 'react';

import { Button, Input, Label, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Textarea } from '../ui';
import { Clock, MapPin, Palette, Trash2 } from 'lucide-react';

import type { MobileCalendarEvent } from './MobileCalendar';

interface MobileEventSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MobileCalendarEvent | null;
  selectedDate: Date | null;
  onSave: (event: MobileCalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444'];

export function MobileEventSheet({ isOpen, onClose, event, selectedDate, onSave, onDelete }: MobileEventSheetProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');
  const [startTime, setStartTime] = useState(event ? formatTime(event.start) : '09:00');
  const [endTime, setEndTime] = useState(event ? formatTime(event.end) : '10:00');
  const [selectedColor, setSelectedColor] = useState(event?.color || COLORS[0]);

  function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function parseTime(timeStr: string, baseDate: Date): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  const handleSave = () => {
    const baseDate = event ? new Date(event.start) : selectedDate || new Date();

    const newEvent: MobileCalendarEvent = {
      id: event?.id || Date.now().toString(),
      title,
      start: parseTime(startTime, baseDate),
      end: parseTime(endTime, baseDate),
      color: selectedColor,
      description: description || undefined,
      location: location || undefined,
    };

    onSave(newEvent);
    handleClose();
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartTime('09:00');
    setEndTime('10:00');
    setSelectedColor(COLORS[0]);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{event ? '일정 수정' : '새 일정'}</SheetTitle>
          <SheetDescription>{event ? '일정 정보를 수정하세요' : '새로운 일정을 추가하세요'}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 overflow-auto pb-20" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="일정 제목을 입력하세요" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          {/* 시간 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              시간
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start-time" className="text-xs text-gray-600">
                  시작
                </Label>
                <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-xs text-gray-600">
                  종료
                </Label>
                <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>

          {/* 위치 */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              위치
            </Label>
            <Input id="location" placeholder="위치를 입력하세요" value={location} onChange={e => setLocation(e.target.value)} />
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea id="description" placeholder="일정 설명을 입력하세요" value={description} onChange={e => setDescription(e.target.value)} rows={4} />
          </div>

          {/* 색상 선택 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              색상
            </Label>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 w-10 rounded-full transition-transform ${selectedColor === color ? 'scale-110 ring-2 ring-gray-400 ring-offset-2' : 'hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`색상 ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="absolute right-0 bottom-0 left-0 border-t bg-white p-4">
          <div className="flex gap-2">
            {event && (
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={!title.trim()}>
              저장
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
