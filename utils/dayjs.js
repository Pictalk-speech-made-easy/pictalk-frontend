import dayjs from 'dayjs';
import 'dayjs/locale/fr'
import 'dayjs/locale/es'
import 'dayjs/locale/it'
import 'dayjs/locale/pt'
import 'dayjs/locale/de'
import 'dayjs/locale/da'
import 'dayjs/locale/fi'
import 'dayjs/locale/nl'
import 'dayjs/locale/nb'
import 'dayjs/locale/sv'
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration'
import localeData from 'dayjs/plugin/localeData'
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from "dayjs/plugin/localizedFormat"
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
export default dayjs;