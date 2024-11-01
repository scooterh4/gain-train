import { isBetterSet } from "../../src/lib/utils";
import { expect, test } from "vitest";

const mockSet = {
  id: '12345',
  created_at: new Date(),
  updated_at: new Date(),
  exercise_id: '123456',
  exerciseLog_id: '1234556',
  set_num: 1,
  weight: 0,
  reps: 0, 
}

test('isBetterSet test 1', () => {
  const newSet = {...mockSet, weight: 150, reps: 5}
  const otherSet = {...mockSet, weight: 140, reps: 5}
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(true)
})

test('isBetterSet test 2', () => {
  const newSet = {...mockSet, weight: 150, reps: 3}
  const otherSet = {...mockSet, weight: 140, reps: 5}
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(true)
})

test('isBetterSet test 3', () => {
  const newSet = {...mockSet, weight: 150, reps: 3}
  const otherSet = {...mockSet, weight: 150, reps: 5}
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(false)
})

test('isBetterSet test 4', () => {
  const newSet = { ...mockSet, weight: 150, reps: 7 }
  const otherSet = { ...mockSet, weight: 150, reps: 3 }
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(true)
})

test('isBetterSet test 5', () => {
  const newSet = {...mockSet, weight: 150, reps: 5}
  const otherSet = undefined
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(true)
})

test('isBetterSet test 6', () => {
  const newSet = {...mockSet, weight: null, reps: 5}
  const otherSet = { ...mockSet, weight: null, reps: 3 }
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(true)
})

test('isBetterSet test 7', () => {
  const newSet = {...mockSet, weight: null, reps: 2}
  const otherSet = { ...mockSet, weight: null, reps: 5 }
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(false)
})

test('isBetterSet test 8', () => {
  const newSet = {...mockSet, weight: null, reps: 2}
  const otherSet = { ...mockSet, weight: 50, reps: 5 }
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(false)
})

test('isBetterSet test 9', () => {
  const newSet = {...mockSet, weight: 100, reps: 2}
  const otherSet = { ...mockSet, weight: null, reps: 5 }
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(true)
})

test('isBetterSet test 10', () => {
  const newSet = {...mockSet, weight: null, reps: 2}
  const otherSet = undefined
  const result = isBetterSet(newSet, otherSet)
  expect(result).toBe(true)
})
