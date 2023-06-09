// Done
const { getArrayOfMistakes } = require('../../analyzeCode');

describe('Unit Test - getArrayOfMistakes', () => {
  test('should return an array of mistakes when the callback returns false', async () => {
    const callback = jest.fn().mockReturnValue(false);
    const code = 'const a = 10;';
    const filePath = 'example.js';
    const repositoryPath = 'https://github.com/stxffyy/tech_debt';
    const repoId = 1;
    const ruleId = 123;
    const result = await getArrayOfMistakes(callback, code, filePath, repositoryPath, repoId, ruleId)();

    expect(callback).toHaveBeenCalledWith(code);
    expect(result).toEqual([
      {
        message: 'В данном файле отсутствует перенос строки в конце',
        lineNumber: 1,
        columnNumber: 0,
        filepath: filePath,
        url: `${repositoryPath}/blob/dev/${filePath}#L1`,
        ruleId: ruleId,
        repositoryId: repoId,
        jiraTaskId: 1,
      },
    ]);
  });

  test('should return an empty array when the callback returns true', async () => {
    const callback = jest.fn().mockReturnValue(true);
    const code = 'const a = 10;';
    const filePath = 'example.js';
    const repositoryPath = 'https://github.com/stxffyy/tech_debt';
    const repoId = 1;
    const ruleId = 123;

    const result = await getArrayOfMistakes(callback, code, filePath, repositoryPath, repoId, ruleId)();

    expect(callback).toHaveBeenCalledWith(code);
    expect(result).toEqual([]);
  });
});
