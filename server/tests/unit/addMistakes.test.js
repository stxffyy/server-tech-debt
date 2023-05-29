const { Mistake } = require('../../models/models');
const sequelize = require('../../database');
const saveMistakesToDatabase = require('../../functions/addMistakesToDB');

jest.mock('../models/models'); // Мокаем модуль models
jest.mock('../database'); // Мокаем модуль database

describe('saveMistakesToDatabase', () => {
  beforeAll(() => {
    // Мокаем методы модели Mistake
    Mistake.create = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should save mistakes to the database', async () => {
    // Подготовка тестовых данных
    const mistakes = [
      {
        message: 'Error 1',
        lineNumber: 10,
        filePath: 'file1.js',
        url: 'http://example.com',
        repositoryId: 1,
        ruleId: 1,
      },
      {
        message: 'Error 2',
        lineNumber: 20,
        filePath: 'file2.js',
        url: 'http://example.com',
        repositoryId: 2,
        ruleId: 2,
      },
    ];

    // Выполнение функции
    await saveMistakesToDatabase(mistakes);

    // Проверка вызовов метода create модели Mistake
    expect(Mistake.create).toHaveBeenCalledTimes(2);
    expect(Mistake.create).toHaveBeenCalledWith({
      message: 'Error 1',
      lineNumber: 10,
      filePath: 'file1.js',
      url: 'http://example.com',
      repositoryId: 1,
      ruleId: 1,
      jiraTaskId: 1,
    });
    expect(Mistake.create).toHaveBeenCalledWith({
      message: 'Error 2',
      lineNumber: 20,
      filePath: 'file2.js',
      url: 'http://example.com',
      repositoryId: 2,
      ruleId: 2,
      jiraTaskId: 1,
    });
  });

  test('should handle unique constraint error', async () => {
    // Мокаем метод create, чтобы выбросить ошибку дубликата
    Mistake.create.mockRejectedValueOnce({ name: 'SequelizeUniqueConstraintError' });

    // Подготовка тестовых данных
    const mistakes = [
      {
        message: 'Error 1',
        lineNumber: 10,
        filePath: 'file1.js',
        url: 'http://example.com',
        repositoryId: 1,
        ruleId: 1,
      },
    ];

    // Выполнение функции
    await saveMistakesToDatabase(mistakes);

    // Проверка вызова метода create
    expect(Mistake.create).toHaveBeenCalledTimes(1);
    expect(Mistake.create).toHaveBeenCalledWith({
      message: 'Error 1',
      lineNumber: 10,
      filePath: 'file1.js',
      url: 'http://example.com',
      repositoryId: 1,
      ruleId: 1,
      jiraTaskId: 1,
    });

    // Проверка вывода сообщения об ошибке
    expect(console.error).toHaveBeenCalledWith('Дубликат данных уже существует');
  });
})
