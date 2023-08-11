import HTTPError from 'http-errors';
import { getData } from './dataStore';
import {
  Error,
  SummaryReturn
} from './interface';

export function summary(step: any | number | null) : SummaryReturn | Error {
  const data = getData();
  const maxStep = 4;
  const itemsPerStep = 10;

  if (step !== null && (step < 0 || step > maxStep)) {
    throw HTTPError(400, 'Step is not one of { null, 1, 2, 3, 4 }');
  }

  const completedItems = data.todos.filter(todo => todo.status === 'DONE').sort((a, b) => b.timeCompleted - a.timeCompleted);

  const startIndex = step === 'null' ? 0 : step * itemsPerStep;
  const endIndex = startIndex + itemsPerStep;

  const todoItemIds = completedItems.slice(startIndex, endIndex).map(todo => todo.todoItemId);

  return { todoItemIds };
}
