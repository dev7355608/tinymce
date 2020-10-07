import { Assert, UnitTest } from '@ephox/bedrock-client';
import fc from 'fast-check';
import * as Fun from 'ephox/katamari/api/Fun';
import * as Maybe from 'ephox/katamari/api/Maybe';

const { just, nothing } = Maybe;

const boom = Fun.die('boom');

UnitTest.test('Maybes.equals: nothing === nothing', () => {
  Assert.eq('eq', true, Maybe.equals(nothing, nothing));
});

UnitTest.test('nothing !== just(x)', () => {
  fc.assert(fc.property(fc.integer(), (i) => {
    Assert.eq('eq', false, Maybe.equals(nothing, just(i)));
  }));
});

UnitTest.test('just(x) !== nothing', () => {
  fc.assert(fc.property(fc.integer(), (i) => {
    Assert.eq('eq', false, Maybe.equals(just(i), nothing));
  }));
});

UnitTest.test('just(x) === just(x)', () => {
  fc.assert(fc.property(fc.integer(), (i) => Assert.eq('eq', true, Maybe.equals(just(i), just(i)))));
});

UnitTest.test('just(x) === just(x) (same ref)', () => {
  fc.assert(fc.property(fc.integer(), (i) => {
    const ob = just(i);
    Assert.eq('eq', true, Maybe.equals(ob, ob));
  }));
});

UnitTest.test('just(x) !== just(x + y) where y is not identity', () => {
  fc.assert(fc.property(fc.string(), fc.string(1, 40), (a, b) => {
    Assert.eq('eq', false, Maybe.equals(just(a), just(a + b)));
  }));
});

UnitTest.test('just: unit tests', () => {
  Assert.eq('eq', true, Maybe.equals(nothing, nothing));
  Assert.eq('eq', false, Maybe.equals(nothing, just(3)));

  Assert.eq('eq', false, Maybe.equals(just(4), nothing));
  Assert.eq('eq', false, Maybe.equals(just(2), just(4)));
  Assert.eq('eq', true, Maybe.equals(just(5), just(5)));
  Assert.eq('eq', false, Maybe.equals(just(5.1), just(5.3)));

  const comparator = (a, b) => Math.round(a) === Math.round(b);

  Assert.eq('eq', true, Maybe.equals_(just(5.1), just(5.3), comparator));
  Assert.eq('eq', false, Maybe.equals_(just(5.1), just(5.9), comparator));
});

UnitTest.test('Maybes.equals_', () => {
  Assert.eq('eq', true, Maybe.equals_(nothing, nothing, boom));
});

UnitTest.test('just !== nothing, for any predicate', () => {
  fc.assert(fc.property(fc.integer().map(just), (opt1) => {
    Assert.eq('eq', false, Maybe.equals_(opt1, nothing, boom));
  }));
});

UnitTest.test('nothing !== just, for any predicate', () => {
  fc.assert(fc.property(fc.integer().map(just), (opt1) => {
    Assert.eq('eq', false, Maybe.equals_(nothing, opt1, boom));
  }));
});

UnitTest.test('Checking Maybe.equals_(just(x), just(y), _, _ -> false) === false', () => {
  fc.assert(fc.property(fc.integer().map(just), fc.integer().map(just), (opt1, opt2) => {
    Assert.eq('eq', false, Maybe.equals_(opt1, opt2, Fun.never));
  }));
});

UnitTest.test('Checking Maybe.equals_(just(x), just(y), _, _ -> true) === true', () => {
  fc.assert(fc.property(fc.integer(), fc.integer(), (a, b) => {
    const opt1 = just(a);
    const opt2 = just(b);
    Assert.eq('eq', true, Maybe.equals_(opt1, opt2, Fun.always));
  }));
});

UnitTest.test('Checking Maybe.equals_(just(x), just(y), f) iff. f(x, y)', () => {
  fc.assert(fc.property(fc.integer().map(just), fc.integer().map(just), fc.func(fc.boolean()), (a, b, f) => {
    const opt1 = just(a);
    const opt2 = just(b);
    return f(a, b) === Maybe.equals_(opt1, opt2, f);
  }));
});