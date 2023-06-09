//DONE
const fs = require('fs-extra');
const gitClone = require('git-clone');
const downloadConfig = require('../../functions/downloadConfig');

jest.mock('fs-extra');
jest.mock('git-clone');

describe('downloadConfig', () => {
  const repositoryURL = 'https://github.com/stxffyy/config';
  const destinationFolder = './config';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should empty the destination folder and clone the repository successfully', async () => {
    fs.emptyDir.mockImplementation((folderPath, callback) => {
      expect(folderPath).toBe(destinationFolder);
      callback(null);
    });

    gitClone.mockImplementation((url, folderPath, options, callback) => {
      expect(url).toBe(repositoryURL);
      expect(folderPath).toBe(destinationFolder);
      callback(null);
    });

    await expect(downloadConfig(repositoryURL, destinationFolder)).resolves.toBeUndefined();

    expect(fs.emptyDir).toHaveBeenCalledTimes(1);
    expect(gitClone).toHaveBeenCalledTimes(1);
  });

  test('should reject with an error if emptying the destination folder fails', async () => {
    const expectedError = new Error('Error emptying the folder');

    fs.emptyDir.mockImplementation((folderPath, callback) => {
      callback(expectedError);
    });

    await expect(downloadConfig(repositoryURL, destinationFolder)).rejects.toThrowError(expectedError);

    expect(fs.emptyDir).toHaveBeenCalledTimes(1);
    expect(gitClone).not.toHaveBeenCalled();
  });

  test('should reject with an error if cloning the repository fails', async () => {
    const expectedError = new Error('Error cloning the repository');

    fs.emptyDir.mockImplementation((folderPath, callback) => {
      callback(null);
    });

    gitClone.mockImplementation((url, folderPath, options, callback) => {
      callback(expectedError);
    });

    await expect(downloadConfig(repositoryURL, destinationFolder)).rejects.toThrowError(expectedError);

    expect(fs.emptyDir).toHaveBeenCalledTimes(1);
    expect(gitClone).toHaveBeenCalledTimes(1);
  });
});
