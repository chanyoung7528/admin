declare const __VITE_FEATURE_DEBUG__: boolean;

type FakerInstance = typeof import('@faker-js/faker').faker;

let fakerInstance: FakerInstance | null = null;

async function getFaker(seed = 12345): Promise<FakerInstance> {
  if (!__VITE_FEATURE_DEBUG__) {
    throw new Error('Faker는 디버그 모드에서만 사용 가능합니다.');
  }

  if (!fakerInstance) {
    const { faker } = await import('@faker-js/faker');
    faker.seed(seed);
    fakerInstance = faker;
  }

  return fakerInstance;
}

function simpleRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simpleRandomDate(from: Date, to: Date): Date {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

export const mockUtils = {
  randomInt: async (min: number, max: number): Promise<number> => {
    if (__VITE_FEATURE_DEBUG__) {
      const faker = await getFaker();
      return faker.number.int({ min, max });
    }
    return simpleRandom(min, max);
  },

  randomElement: async <T>(array: T[]): Promise<T> => {
    if (__VITE_FEATURE_DEBUG__) {
      const faker = await getFaker();
      return faker.helpers.arrayElement(array);
    }
    return array[simpleRandom(0, array.length - 1)] as T;
  },

  randomDate: async (from: string | Date, to: string | Date): Promise<Date> => {
    const fromDate = typeof from === 'string' ? new Date(from) : from;
    const toDate = typeof to === 'string' ? new Date(to) : to;

    if (__VITE_FEATURE_DEBUG__) {
      const faker = await getFaker();
      return faker.date.between({ from: fromDate, to: toDate });
    }
    return simpleRandomDate(fromDate, toDate);
  },

  createArray: <T>(length: number, factory: (index: number) => T | Promise<T>): Promise<T[]> => {
    return Promise.all(Array.from({ length }, (_, index) => factory(index)));
  },
};
