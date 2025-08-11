import {
  CalendarDateTime,
  ZonedDateTime,
  getDayOfWeek,
  getLocalTimeZone,
  toTimeZone,
  today,
  now,
  type DateValue,
} from "@internationalized/date";

export function getNowStr(format = "Y-m-d H:i:s") {
  return formatDate(now(getLocalTimeZone()), false, format)
}

export function formatDate(value: DateValue, localTime = false, format: string): string {
  const { year, month, day } = value;
  const hour = "hour" in value ? value.hour : 0;
  const minute = "minute" in value ? value.minute : 0;
  const second = "second" in value ? value.second : 0;

  let date = new CalendarDateTime(year, month, day, hour, minute, second);
  if (localTime) {
    let zt = new ZonedDateTime(year, month, day, "UTC", 0, hour, minute, second);
    zt = toTimeZone(zt, getLocalTimeZone());
    date = date.add({
      seconds: zt.offset / 1000,
    });
  }

  const pad = (num?: number): string => num?.toString().padStart(2, "0") || "";

  const formatMapping: { [key: string]: string } = {
    Y: date.year.toString(),
    m: pad(date.month),
    d: pad(date.day),
    w: getDayOfWeek(date, "en-US").toString(),
    H: pad(date.hour),
    h: pad(date.hour % 12 || 12),
    i: pad(date.minute),
    s: pad(date.second),
    a: date.hour < 12 ? "am" : "pm",
  };

  // Replace format tokens with actual values
  let formattedDate = format;
  for (const token in formatMapping) {
    formattedDate = formattedDate.replace(new RegExp(token, "g"), formatMapping[token]);
  }

  return formattedDate;
}

export function formatDateStr(
  dateStr: string,
  localTime = false,
  toFormat = "Y-m-d h:i a",
  fromFormat = "Y-m-d H:i:s"
) {
  const dt = parseDateStr(dateStr, fromFormat);

  if (dt) {
    return formatDate(dt, localTime, toFormat);
  }

  return dateStr;
}

export function parseDateStr(value: string, format: string): CalendarDateTime | undefined {
  value = value.replace("T", " ").replace("Z", "").split(".")[0];

  const regexTokens: { [key: string]: { pattern: string; length: number } } = {
    Y: { pattern: "(__D__{4})", length: 4 },
    m: { pattern: "(__D__{2})", length: 2 },
    d: { pattern: "(__D__{2})", length: 2 },
    w: { pattern: "(__D__)", length: 1 },
    H: { pattern: "(__D__{2})", length: 2 },
    h: { pattern: "(__D__{2})", length: 2 },
    i: { pattern: "(__D__{2})", length: 2 },
    s: { pattern: "(__D__{2})", length: 2 },
    a: { pattern: "(am|pm)", length: 2 },
  };

  const tokenPositions: { [key: string]: number } = {};

  let regexPattern = format;
  for (const token in regexTokens) {
    const index = format.indexOf(token);
    tokenPositions[token] = index;

    regexPattern = regexPattern.replace(new RegExp(token, "g"), regexTokens[token].pattern);
  }

  regexPattern = regexPattern.replace(/__D__/g, "\\d");

  let cursorIndex = 0;
  for (const token in tokenPositions) {
    if (tokenPositions[token] >= 0) {
      tokenPositions[token] += cursorIndex;
      cursorIndex += regexTokens[token].length - 1;
    }
  }

  const regex = new RegExp(`^${regexPattern}$`);
  const match = value.match(regex);

  if (!match) {
    // throw new Error('Date string does not match the format')
    return;
  }

  // Extract values from the regex match groups
  const extractValue = (token: string, defaultValue: number = 0): number => {
    const index = tokenPositions[token];
    if (index !== -1) {
      return parseInt(value.substring(index, index + regexTokens[token].length), 10);
    }

    return defaultValue;
  };

  const year = extractValue("Y");
  const month = extractValue("m");
  const day = extractValue("d");
  const amPmIndex = tokenPositions["a"] || -1;
  let hour = amPmIndex === -1 ? extractValue("H") : extractValue("h");
  const minute = extractValue("i");
  const second = extractValue("s");

  // Handle the am/pm token
  if (amPmIndex !== -1) {
    const amPm = value.substring(amPmIndex, amPmIndex + regexTokens["a"].length);
    if (amPm === "pm" && hour < 12) {
      hour += 12;
    } else if (amPm === "am" && hour === 12) {
      hour = 0;
    }
  }

  return new CalendarDateTime(year, month, day, hour, minute, second);
}

export function getTimeElapsedStr(timestmap: number) {
  const now = new Date().getTime();
  const elapsed = now - timestmap;

  if (elapsed < 60 * 1000) {
    return `${Math.floor(elapsed / 1000)} sec ago`;
  } else if (elapsed < 60 * 60 * 1000) {
    return `${Math.floor(elapsed / (60 * 1000))} min ago`;
  } else if (elapsed < 24 * 60 * 60 * 1000) {
    return `${Math.floor(elapsed / (60 * 60 * 1000))} hr ago`;
  } else {
    return `${Math.floor(elapsed / (24 * 60 * 60 * 1000))} days ago`;
  }
}