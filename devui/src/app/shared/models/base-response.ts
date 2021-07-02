export interface BaseResponse {

	code: number;
	message: string;
	data: any;
	details: any;
	status?: number;
	response?: any;
	uiDecorator?:any;
}