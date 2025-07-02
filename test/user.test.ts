import { expect } from 'chai';

describe('User Stats Logic', () => {
  it('calculates win percentage correctly', () => {
    const wins = 7;
    const games = 10;
    const winPct = ((wins / games) * 100).toFixed(1) + "%";
    expect(winPct).to.equal('70.0%');
  });

  it('defaults to 0% if no games played', () => {
    const wins = 0;
    const games = 0;
    const winPct = games ? ((wins / games) * 100).toFixed(1) + "%" : "0%";
    expect(winPct).to.equal('0%');
  });
});