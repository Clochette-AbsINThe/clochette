import { debounce } from '@hooks/useWindowSize';

test('Debounce fonction', async () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toBeCalled();

    for (let i = 0; i < 10; i++) {
        debouncedFunc();
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    expect(func).toBeCalledTimes(0);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(func).toBeCalled();
});
