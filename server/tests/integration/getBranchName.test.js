// Done
const { getBranchName } = require('../../analyzeCode');

describe('Unit Test - getBranchName', () => {
  test('should return the branch name when provided with a valid repository URL', async () => {
    const repoUrl = 'https://github.com/stxffyy/tech_debt';
    const result = await getBranchName(repoUrl);

    expect(result).toEqual('dev');
  });

  test('should return an empty string when provided with an invalid repository URL', async () => {
    const repoUrl = 'https://github.com/stxffyy/invalid-repo';
    const result = await getBranchName(repoUrl);

    expect(result).toEqual('');
  });
});
