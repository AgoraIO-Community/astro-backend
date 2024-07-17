import { expect, test, vi } from 'vitest';
import { POST } from '../pages/api/token.json';

test('api/token.json returns a string', async () => {
    const mockRequest = {
        json: vi.fn().mockResolvedValue({
            uid: "20",
            channel: "test",
            role: "publisher",
            expireTime: "3600"
        })
    };

    const response = await POST({ request: mockRequest } as any);
    const data = await response.json();
    expect(typeof data.token).toBe('string');
    expect(data.token.length).toBeGreaterThan(0);
});

test('api/token.json returns "uid is required" when no uid is passed', async () => {
    const mockRequest = {
        json: vi.fn().mockResolvedValue({
            channel: "test",
            role: "publisher",
            expireTime: "3600"
        })
    };

    const response = await POST({ request: mockRequest } as any);
    const text = await response.text();

    expect(text).toBe('uid is required');
});

test('api/token.json returns "channel is required" when no channel is passed', async () => {
    const mockRequest = {
        json: vi.fn().mockResolvedValue({
            uid: "20",
            role: "publisher",
            expireTime: "3600"
        })
    };

    const response = await POST({ request: mockRequest } as any);
    const text = await response.text();

    expect(text).toBe('channel is required');
});

test('api/token.json returns "role is incorrect" when no role or role is not publisher or subscriber is passed', async () => {
    const mockRequest = {
        json: vi.fn().mockResolvedValue({
            uid: "20",
            channel: "test",
            expireTime: "3600"
        })
    };

    const response = await POST({ request: mockRequest } as any);
    const text = await response.text();

    expect(text).toBe('role is incorrect');

    const mockRequest2 = {
        json: vi.fn().mockResolvedValue({
            uid: "20",
            channel: "test",
            role: "test",
            expireTime: "3600"
        })
    };

    const response2 = await POST({ request: mockRequest2 } as any);
    const text2 = await response2.text();

    expect(text2).toBe('role is incorrect');
});


test('api/token.json returns "expireTime is required" when no expireTime is passed', async () => {
    const mockRequest = {
        json: vi.fn().mockResolvedValue({
            uid: "20",
            role: "publisher",
            channel: "test"
        })
    };

    const response = await POST({ request: mockRequest } as any);
    const text = await response.text();

    expect(text).toBe('expireTime is required');
});

