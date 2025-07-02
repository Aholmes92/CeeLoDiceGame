import { expect } from 'chai';
import { GET } from '../src/app/api/users/me/route';
import { NextRequest } from 'next/server';

describe('GET /api/users/me', () => {
  it('should return 401 if no token provided', async () => {
    const req = new Request('http://localhost/api/users/me', {
      method: 'GET',
      headers: { cookie: '' }
    }) as NextRequest;

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).to.equal(401);
    expect(data.message).to.equal("Unauthorized");
  });
});
