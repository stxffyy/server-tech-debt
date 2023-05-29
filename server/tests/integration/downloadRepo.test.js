// Done
const fs = require('fs');
const path = require('path');
const { downloadRepository } = require('../../analyzeCode');

describe('downloadRepository', () => {
  beforeAll(() => {
    const testFolder = path.join(__dirname, 'tmp/example3');
    fs.mkdirSync(testFolder, { recursive: true });
  });

  afterAll(() => {
    const testFolder = path.join(__dirname, 'tmp/example3');
    fs.rmSync(testFolder, { recursive: true });
  });

  it('should successfully download a repository', async () => {
    const repositoryPath = 'https://github.com/stxffyy/example3';
    const result = await downloadRepository(repositoryPath);
    const files = fs.readdirSync(result);
    expect(files.length).toBeGreaterThan(0);
  });

  it('should handle download errors', async () => {
    const repositoryPath = 'https://github.com/stxffyy/tejdkdkfkf';
    await expect(downloadRepository(repositoryPath)).rejects.toThrow();
  });
});
