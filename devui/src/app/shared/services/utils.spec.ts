import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppUtils } from './utils';

describe('AppUtils', () => {
    let httpMock: HttpTestingController;
    let appUtils: AppUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AppUtils]
        });

        appUtils = TestBed.get(AppUtils);
        httpMock = TestBed.get(HttpTestingController);

    });

    it('removeMarkups should be created', () => {
        expect(appUtils).toBeTruthy();
    });

    it('Should contain a property called addedOpenTag', () => {
        expect(appUtils['addedOpenTag']).toBeDefined();
        expect(appUtils['addedOpenTag']).toEqual('<added>');
    });

    it('Should contain a property called addedCloseTag', () => {
        expect(appUtils['addedCloseTag']).toBeDefined();
        expect(appUtils['addedCloseTag']).toEqual('</added>');
    });

    it('Should contain a property called deletedOpenTag', () => {
        expect(appUtils['deletedOpenTag']).toBeDefined();
        expect(appUtils['deletedOpenTag']).toEqual('<deleted>');
    });

    it('Should contain a property called deletedCloseTag', () => {
        expect(appUtils['deletedCloseTag']).toBeDefined();
        expect(appUtils['deletedCloseTag']).toEqual('</deleted>');
    });

    it('removeMarkups should return an object without markups only added', () => {
        const objectWithMarkups = { test: '<added>added</added>' };
        const objectWithoutMarkups = { test: 'added' };

        const result = appUtils.removeMarkups(objectWithMarkups);

        expect(result).toEqual(objectWithoutMarkups);
    });

    it('removeMarkups should return an object without markups only deleted', () => {
        const objectWithMarkups = { test: '<deleted>deleted</deleted>' };
        const objectWithoutMarkups = { test: '' };

        const result = appUtils.removeMarkups(objectWithMarkups);
        expect(result).toEqual(objectWithoutMarkups);
    });

    it('removeMarkups should return an object without markups added - deleted', () => {
        const objectWithMarkups = { test: '<added>added</added><deleted>deleted</deleted>' };
        const objectWithoutMarkups = { test: 'added' };
        const result = appUtils.removeMarkups(objectWithMarkups);
        expect(result).toEqual(objectWithoutMarkups);
    });

    it('removeMarkups should return an object without markups deleted - added', () => {
        const objectWithMarkups = { test: '<deleted>deleted</deleted><added>added</added>' };
        const objectWithoutMarkups = { test: 'added' };
        const result = appUtils.removeMarkups(objectWithMarkups);
        expect(result).toEqual(objectWithoutMarkups);
    });

    it('removeMarkups should return an object without markups empty', () => {
        const objectWithMarkups = { test: '' };
        const objectWithoutMarkups = { test: '' };
        const result = appUtils.removeMarkups(objectWithMarkups);
        expect(result).toEqual(objectWithoutMarkups);
    });

    it('removeMarkups should return an object without markups no markups', () => {
        const objectWithMarkups = { test: 'content without markups' };
        const objectWithoutMarkups = { test: 'content without markups' };
        const result = appUtils.removeMarkups(objectWithMarkups);
        expect(result).toEqual(objectWithoutMarkups);
    });

    it('removeMarkups should return a string without markups only added', () => {
        const withMarkups = '<added>added</added>';
        const withoutMarkups = 'added';
        const result = appUtils.removeMarkups(withMarkups);
        expect(result).toEqual(withoutMarkups);
    });

    it('removeMarkups should return a string without markups only deleted', () => {
        const withMarkups = '<deleted>deleted</deleted>';
        const withoutMarkups = '';
        const result = appUtils.removeMarkups(withMarkups);
        expect(result).toEqual(withoutMarkups);
    });

    it('removeMarkups should return a string without markups added - deleted', () => {
        const withMarkups ='<added>added</added><deleted>deleted</deleted>';
        const withoutMarkups = 'added';
        const result = appUtils.removeMarkups(withMarkups);
        expect(result).toEqual(withoutMarkups);
    });

    it('removeMarkups should return a string without markups deleted - added', () => {
        const withMarkups ='<deleted>deleted</deleted><added>added</added>';
        const withoutMarkups = 'added';
        const result = appUtils.removeMarkups(withMarkups);
        expect(result).toEqual(withoutMarkups);
    });

    it('removeMarkups should return an empty string', () => {
        const withMarkups = '';
        const withoutMarkups = '';
        const result = appUtils.removeMarkups(withMarkups);
        expect(result).toEqual(withoutMarkups);
    });

    it('removeMarkups should return a string no markups', () => {
        const testElement = 'Element no markups';
        const testElementExpect = 'Element no markups';
        const result = appUtils.removeMarkups(testElement);
        expect(result).toEqual(testElementExpect);
    });
});