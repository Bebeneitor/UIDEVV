import { async, TestBed } from "@angular/core/testing";
import { MidRuleVersionPipe } from "./midRuleVersion.pipe";

fdescribe("Pipe mid rules version", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  it("create an instance", () => {
    const pipe = new MidRuleVersionPipe();
    expect(pipe).toBeTruthy();
  });

  it("should return midRule", () => {
    const midRule = "123.1";
    const pipe = new MidRuleVersionPipe();
    const result = pipe.transform(midRule);
    expect(result).toBe("123");
  });

  it("should return version", () => {
    const midRule = "123.1";
    const pipe = new MidRuleVersionPipe();
    const result = pipe.transform(midRule, true);
    expect(result).toBe("1");
  });
});
