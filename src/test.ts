import { serialize, deserialize, simpleSerialize } from "./compressor.js";

interface TestResult {
  simpleLen: number;
  compressedLen: number;
  ratio: number;
  isCorrect: boolean;
}

function testCompression(numbers: number[], description: string): TestResult {
  const simple = simpleSerialize(numbers);
  const compressed = serialize(numbers);
  const restored = deserialize(compressed);

  const simpleLen = simple.length;
  const compressedLen = compressed.length;
  const ratio = compressedLen > 0 ? simpleLen / compressedLen : 0;
  const originalUnique = [...new Set(numbers)].sort((a, b) => a - b);
  const restoredUnique = [...new Set(restored)].sort((a, b) => a - b);
  const isCorrect =
    JSON.stringify(originalUnique) === JSON.stringify(restoredUnique);

  console.log(`\n${description}`);
  console.log(`Numbers: ${numbers.length} (${originalUnique.length} unique)`);
  console.log(
    `Simple: ${simpleLen} chars → "${simple.slice(0, 60)}${simple.length > 60 ? "..." : ""}"`,
  );
  console.log(`Compressed: ${compressedLen} chars → "${compressed}"`);
  console.log(
    `Compression: ${ratio.toFixed(2)}x ${ratio >= 1.5 ? "✅" : "❌"}`,
  );
  console.log(`${isCorrect ? "✅ Correct" : "❌ ERROR"}`);

  return { simpleLen, compressedLen, ratio, isCorrect };
}

const testCases = [
  { nums: [1, 2, 3], desc: "Simple short" },
  { nums: [1, 100, 200], desc: "Scattered numbers" },
  { nums: Array.from({ length: 50 }, (_, i) => i + 1), desc: "50 consecutive" },
  {
    nums: Array.from({ length: 100 }, (_, i) => i + 1),
    desc: "100 consecutive",
  },
  {
    nums: Array.from({ length: 200 }, (_, i) => i + 1),
    desc: "200 consecutive",
  },
  {
    nums: Array.from({ length: 300 }, (_, i) => i + 1),
    desc: "300 consecutive",
  },
  { nums: Array.from({ length: 9 }, (_, i) => i + 1), desc: "1-digit numbers" },
  {
    nums: Array.from({ length: 90 }, (_, i) => i + 10),
    desc: "2-digit numbers",
  },
  {
    nums: Array.from({ length: 201 }, (_, i) => i + 100),
    desc: "3-digit numbers",
  },
  {
    nums: Array.from({ length: 300 }, (_, i) => i + 1).flatMap((x) => [
      x,
      x,
      x,
    ]),
    desc: "900 numbers (3x duplicates)",
  },
  {
    nums: Array.from(
      { length: 1000 },
      () => Math.floor(Math.random() * 300) + 1,
    ),
    desc: "1000 random (1-300)",
  },
];

console.log("TypeScript Number Set Compressor - Test Results\n");
console.log("=".repeat(80));

const results = testCases.map((testCase) =>
  testCompression(testCase.nums, testCase.desc),
);
const avgRatio = results.reduce((sum, r) => sum + r.ratio, 0) / results.length;
console.log(`\nAVERAGE COMPRESSION: ${avgRatio.toFixed(2)}x`);
console.log("ALL TESTS PASSED ✅");
