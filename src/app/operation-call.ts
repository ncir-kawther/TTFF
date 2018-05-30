export interface OperationCall {

    opname ?: string; // the "?" makes the property optional, 
    info ?: boolean; //  so you can start with an empty object
    exception ?: boolean;
}
