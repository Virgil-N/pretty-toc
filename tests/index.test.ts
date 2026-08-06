import { expectTypeOf, test } from 'vitest'
import prettyToc from '../src/index'

test('prettyToc', () => {
  expectTypeOf(prettyToc).toBeFunction()
})
