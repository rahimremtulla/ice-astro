// src/types/react-date-range.d.ts
declare module 'react-date-range' {
  import { Locale } from 'date-fns';

  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface DateRangeProps {
    ranges: Range[];
    onChange: (item: { selection: Range }) => void;
    moveRangeOnFirstSelection?: boolean;
    editableDateInputs?: boolean;
    minDate?: Date;
    maxDate?: Date;
    firstDayOfWeek?: number;
    locale?: Locale;
    dateDisplayFormat?: string;
  }

  export const DateRange: React.ComponentType<DateRangeProps>;
}