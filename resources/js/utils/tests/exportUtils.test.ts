import { beforeEach } from 'node:test';
import { describe, expect, test, vi } from 'vitest';
import { downloadFile } from '../downloadFile';
import { generateCSV } from '../exportUtils';

describe('exportUtils tests', () => {
  beforeEach(() => {
    const mock = vi.hoisted(() => {
      return {
        downloadFile: vi.fn().mockReturnValue(true),
      };
    });

    vi.mock('@/utils/downloadFile', () => ({
      downloadFile: mock.downloadFile,
    }));
  });
  describe('genenerateCSV tests', () => {
    test('It calls downloadFile with the csv type', () => {
      generateCSV([], []);
      expect(downloadFile).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalledWith('', 'csv');
    });

    test('It calls downloadFile with the expected data', () => {
      generateCSV(
        ['column 1', 'column 2'],
        [
          ['test1', 'test2'],
          ['test3', 'test4'],
        ],
      );
      expect(downloadFile).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalledWith('column 1,column 2\ntest1,test2\ntest3,test4', 'csv');
    });
  });
});
