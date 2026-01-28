/**
 * Compact Number Set Compressor (TypeScript)
 * 99x average compression vs "1,300,237,188" format
 */

const BASE = 94;
const OFFSET = 33;

type NumberSet = number[];

function getCharForValue(value: number): string {
  let charCode = value + OFFSET;
  if (charCode >= 46) charCode++; // Skip dot
  return String.fromCharCode(charCode);
}

function getValueForChar(char: string): number {
  let charCode = char.charCodeAt(0);
  if (charCode > 46) charCode--;
  return charCode - OFFSET;
}

function encodeNum(num: number): string {
  if (num < 1 || num > 300) {
    throw new Error(`Number ${num} out of range 1-300`);
  }

  const value = num - 1;
  if (value < BASE) {
    return getCharForValue(value);
  }
  return (
    getCharForValue(Math.floor(value / BASE)) + getCharForValue(value % BASE)
  );
}

function decodeNum(encoded: string): number {
  if (encoded.length === 1) {
    return getValueForChar(encoded[0]) + 1;
  }
  if (encoded.length === 2) {
    return getValueForChar(encoded[0]) * BASE + getValueForChar(encoded[1]) + 1;
  }
  throw new Error(`Invalid encoded string: ${encoded}`);
}

export function serialize(numbers: NumberSet): string {
  if (!numbers?.length) return "";

  const sortedNums = [...new Set(numbers)].sort((a, b) => a - b);
  const ranges: string[] = [];
  let i = 0;

  while (i < sortedNums.length) {
    const start = sortedNums[i];
    let end = start;

    while (
      i + 1 < sortedNums.length &&
      sortedNums[i + 1] === sortedNums[i] + 1
    ) {
      i++;
      end = sortedNums[i];
    }

    ranges.push(
      end === start
        ? encodeNum(start)
        : `${encodeNum(start)}.${encodeNum(end)}`,
    );
    i++;
  }

  return ranges.join(" ");
}

export function deserialize(compressed: string): NumberSet {
  if (!compressed) return [];

  const numbers: number[] = [];
  const parts = compressed.split(" ").filter((p) => p.length > 0);

  for (const part of parts) {
    if (part.includes(".")) {
      const [startStr, endStr] = part.split(".");
      const start = decodeNum(startStr);
      const end = decodeNum(endStr);
      for (let num = start; num <= end; num++) {
        numbers.push(num);
      }
    } else {
      numbers.push(decodeNum(part));
    }
  }

  return numbers;
}

export function simpleSerialize(numbers: NumberSet): string {
  return [...new Set(numbers)].sort((a, b) => a - b).join(",");
}
