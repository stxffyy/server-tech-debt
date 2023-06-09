require('@babel/register');
const fetch = require('node-fetch');
const sendRequest = require('../../functions/createTickets');

jest.mock('node-fetch');

describe('sendRequest', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should send a request to Jira and resolve with the response', async () => {
    const method = 'POST';
    const url = 'https://stxffyy.atlassian.net/rest/api/2/issue';
    const description = 'Ticket description';
    const summaryName = 'Ticket summary';

    const expectedResponse = { id: '12345', key: 'ABC-123' };

    fetch.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValueOnce(expectedResponse),
    });

    const result = await sendRequest(method, url, description, summaryName);

    expect(fetch).toHaveBeenCalledWith(url, {
      method: method,
      headers: expect.objectContaining({
        'Authorization': expect.any(String),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        "fields": {
          "project": {
            "id": "10001"
          },
          "summary": summaryName,
          "description": description,
          "issuetype": {
            "id": "10005"
          }
        }
      }),
    });

    expect(result).toEqual(expectedResponse);
  });

  test('should reject with an error when the request fails', async () => {
    const method = 'POST';
    const url = 'https://stxffyy.atlassian.net/rest/api/2/issue';
    const description = 'Ticket description';
    const summaryName = 'Ticket summary';

    const expectedError = new Error('Request failed');

    fetch.mockRejectedValueOnce(expectedError);

    await expect(sendRequest(method, url, description, summaryName)).rejects.toThrowError(expectedError);
    expect(fetch).toHaveBeenCalledWith(url, expect.any(Object));
  });
});
