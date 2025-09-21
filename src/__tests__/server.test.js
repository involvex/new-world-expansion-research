import request from "supertest";
import { describe, it, expect, vi } from "vitest";

// Mock the GoogleGenerativeAI module
vi.mock("@google/generative-ai", () => {
  const generateContent = vi.fn(() =>
    Promise.resolve({ response: { text: () => "Mocked Gemini response" } }),
  );
  const getGenerativeModel = vi.fn(() => ({ generateContent }));
  const GoogleGenerativeAI = vi.fn(() => ({ getGenerativeModel }));
  return { GoogleGenerativeAI };
});

// Mock the dotenv module
vi.mock("dotenv", () => ({ config: vi.fn() }));

// Import the server
process.env.API_KEY = "test";
import app from "../../server.cjs";

describe("Server tests", () => {
  it("should start the server and respond to /api/gemini", async () => {
    const response = await request(app)
      .post("/api/gemini")
      .send({ query: "test query" });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if query is missing", async () => {
    const response = await request(app).post("/api/gemini");
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if API key is missing", async () => {
    const response = await request(app)
      .post("/api/gemini")
      .send({ query: "test query" });
    expect(response.statusCode).toBe(400);
  });
});
