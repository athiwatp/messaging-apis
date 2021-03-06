import querystring from 'querystring';

import MockAdapter from 'axios-mock-adapter';

import SlackOAuthClient from '../SlackOAuthClient';

const TOKEN = 'xxxx-xxxxxxxxx-xxxx';
const CHANNEL = 'C1234567890';

const createMock = () => {
  const client = new SlackOAuthClient(TOKEN);
  const mock = new MockAdapter(client.getHTTPClient());
  return { client, mock };
};

describe('connect', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with slack api url', () => {
    axios.create = jest.fn();
    SlackOAuthClient.connect(TOKEN);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://slack.com/api/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  });
});

describe('constructor', () => {
  let axios;
  let _create;
  beforeEach(() => {
    axios = require('axios'); // eslint-disable-line global-require
    _create = axios.create;
  });

  afterEach(() => {
    axios.create = _create;
  });

  it('create axios with with slack api url', () => {
    axios.create = jest.fn();
    new SlackOAuthClient(TOKEN); // eslint-disable-line no-new

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://slack.com/api/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  });
});

describe('#getHTTPClient', () => {
  it('should return underlying http client', () => {
    const client = new SlackOAuthClient(TOKEN);
    const http = client.getHTTPClient();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
  });
});

describe('#callMethod', () => {
  it('should call slack api', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.callMethod('chat.postMessage', {
      channel: CHANNEL,
      text: 'hello',
    });

    expect(res).toEqual(reply);
  });

  it('should throw if slack api return not ok', async () => {
    expect.assertions(1);
    const { client, mock } = createMock();

    const reply = {
      ok: false,
      error: 'something wrong',
      ts: '1405895017.000506',
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    try {
      await client.callMethod('chat.postMessage', {
        channel: CHANNEL,
        text: 'hello',
      });
    } catch (e) {
      expect(e).toEqual(new Error('something wrong'));
    }
  });
});

describe('#postMessage', () => {
  it('should call chat.postMessage with channel and text', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, 'hello');

    expect(res).toEqual(reply);
  });

  it('should call chat.postMessage with channel and text and optional options', async () => {
    const { client, mock } = createMock();

    const reply = {
      ok: true,
      ts: '1405895017.000506',
      channel: 'C024BE91L',
      message: {},
    };

    mock
      .onPost(
        '/chat.postMessage',
        querystring.stringify({
          channel: CHANNEL,
          text: 'hello',
          as_user: true,
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.postMessage(CHANNEL, 'hello', { as_user: true });

    expect(res).toEqual(reply);
  });
});

describe('#getUserList', () => {
  it('should call users.list api', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply = {
      ok: true,
      members,
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'dXNlcjpVMEc5V0ZYTlo=',
      },
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: undefined,
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserList();

    expect(res).toEqual(members);
  });
});

describe('#getAllUserList', () => {
  it('should call users.list api', async () => {
    const { client, mock } = createMock();

    const members = [
      {
        id: 'U023BECGF',
        team_id: 'T021F9ZE2',
        name: 'bobby',
        deleted: false,
        color: '9f69e7',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: 'ge3b51ca72de',
          current_status: ':mountain_railway: riding a train',
          first_name: 'Bobby',
          last_name: 'Tables',
          real_name: 'Bobby Tables',
          email: 'bobby@slack.com',
          skype: 'my-skype-name',
          phone: '+1 (123) 456 7890',
          image_24: 'https://...',
          image_32: 'https://...',
          image_48: 'https://...',
          image_72: 'https://...',
          image_192: 'https://...',
        },
        is_admin: true,
        is_owner: true,
        updated: 1490054400,
        has_2fa: false,
      },
      {
        id: 'W07QCRPA4',
        team_id: 'T0G9PQBBK',
        name: 'glinda',
        deleted: false,
        color: '9f69e7',
        real_name: 'Glinda Southgood',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        profile: {
          avatar_hash: '8fbdd10b41c6',
          image_24: 'https://a.slack-edge.com...png',
          image_32: 'https://a.slack-edge.com...png',
          image_48: 'https://a.slack-edge.com...png',
          image_72: 'https://a.slack-edge.com...png',
          image_192: 'https://a.slack-edge.com...png',
          image_512: 'https://a.slack-edge.com...png',
          image_1024: 'https://a.slack-edge.com...png',
          image_original: 'https://a.slack-edge.com...png',
          first_name: 'Glinda',
          last_name: 'Southgood',
          title: 'Glinda the Good',
          phone: '',
          skype: '',
          real_name: 'Glinda Southgood',
          real_name_normalized: 'Glinda Southgood',
          email: 'glenda@south.oz.coven',
        },
        is_admin: true,
        is_owner: false,
        is_primary_owner: false,
        is_restricted: false,
        is_ultra_restricted: false,
        is_bot: false,
        updated: 1480527098,
        has_2fa: false,
      },
    ];

    const reply1 = {
      ok: true,
      members: [members[0]],
      cache_ts: 1498777272,
      response_metadata: {
        next_cursor: 'cursor1',
      },
    };

    const reply2 = {
      ok: true,
      members: [members[1]],
      cache_ts: 1498777272,
    };

    mock
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: undefined,
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply1)
      .onPost(
        '/users.list',
        querystring.stringify({
          cursor: 'cursor1',
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .replyOnce(200, reply2);

    const res = await client.getAllUserList();

    expect(res).toEqual(members);
  });
});

describe('#getUserInfo', () => {
  it('should call users.info with user id', async () => {
    const { client, mock } = createMock();

    const user = {
      id: 'U023BECGF',
      name: 'bobby',
      deleted: false,
      color: '9f69e7',
      profile: {
        avatar_hash: 'ge3b51ca72de',
        current_status: ':mountain_railway: riding a train',
        first_name: 'Bobby',
        last_name: 'Tables',
        real_name: 'Bobby Tables',
        tz: 'America/Los_Angeles',
        tz_label: 'Pacific Daylight Time',
        tz_offset: -25200,
        email: 'bobby@slack.com',
        skype: 'my-skype-name',
        phone: '+1 (123) 456 7890',
        image_24: 'https://...',
        image_32: 'https://...',
        image_48: 'https://...',
        image_72: 'https://...',
        image_192: 'https://...',
      },
      is_admin: true,
      is_owner: true,
      updated: 1490054400,
      has_2fa: true,
    };

    const reply = {
      ok: true,
      user,
    };

    mock
      .onPost(
        '/users.info',
        querystring.stringify({
          user: 'U023BECGF',
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getUserInfo('U023BECGF');

    expect(res).toEqual(user);
  });
});

describe('#getChannelList', () => {
  it('should call channels.list api', async () => {
    const { client, mock } = createMock();

    const channels = [
      {
        id: 'C024BE91L',
        name: 'fun',
        created: 1360782804,
        creator: 'U024BE7LH',
        is_archived: false,
        is_member: false,
        num_members: 6,
        topic: {
          value: 'Fun times',
          creator: 'U024BE7LV',
          last_set: 1369677212,
        },
        purpose: {
          value: 'This channel is for fun',
          creator: 'U024BE7LH',
          last_set: 1360782804,
        },
      },
    ];

    const reply = {
      ok: true,
      channels,
    };

    mock
      .onPost(
        '/channels.list',
        querystring.stringify({
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getChannelList();

    expect(res).toEqual(channels);
  });
});

describe('#getChannelInfo', () => {
  it('should call channels.info with channel id', async () => {
    const { client, mock } = createMock();

    const channel = {
      id: 'C024BE91L',
      name: 'fun',

      created: 1360782804,
      creator: 'U024BE7LH',

      is_archived: false,
      is_general: false,
      is_member: true,
      is_starred: true,

      members: [],

      topic: {},
      purpose: {},

      last_read: '1401383885.000061',
      latest: {},
      unread_count: 0,
      unread_count_display: 0,
    };

    const reply = {
      ok: true,
      channel,
    };

    mock
      .onPost(
        '/channels.info',
        querystring.stringify({
          channel: 'C024BE91L',
          token: TOKEN,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .reply(200, reply);

    const res = await client.getChannelInfo('C024BE91L');

    expect(res).toEqual(channel);
  });
});
