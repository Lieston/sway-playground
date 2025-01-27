import * as React from "react";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ParameterInput from "./ParameterInput";
import { TypeInfo } from "../utils/getTypeInfo";
import { styled } from "@mui/material/styles";
import useTheme from "../../../context/theme";

export type ParamTypeLiteral =
  | "number"
  | "bool"
  | "string"
  | "object"
  | "option"
  | "enum"
  | "vector";
export type SimpleParamValue = number | boolean | string;
export type ObjectParamValue = Record<
  string,
  SimpleParamValue | Record<string, unknown> | VectorParamValue
>;
export type VectorParamValue = Array<CallableParamValue>;
export type CallableParamValue =
  | SimpleParamValue
  | ObjectParamValue
  | VectorParamValue;

export interface InputInstance {
  name: string;
  type: TypeInfo;
  components?: InputInstance[];
}

interface FunctionParametersProps {
  inputInstances: InputInstance[];
  functionName: string;
  paramValues: SimpleParamValue[];
  setParamValues: (values: SimpleParamValue[]) => void;
}

export function FunctionParameters({
  inputInstances,
  functionName,
  paramValues,
  setParamValues,
}: FunctionParametersProps) {
  const { themeColor } = useTheme();
  // Custom Table component
  const StyledTableCell = styled(TableCell)`
    color: ${themeColor("black1")};
  `;

  const setParamAtIndex = React.useCallback(
    (index: number, value: SimpleParamValue) => {
      const newParamValues = [...paramValues];
      newParamValues[index] = value;
      setParamValues(newParamValues);
    },
    [paramValues, setParamValues],
  );

  if (!inputInstances.length) {
    return <React.Fragment />;
  }

  return (
    <TableContainer
      component={Paper}
      style={{ background: themeColor("gray5") }}
    >
      <Table aria-label="function parameter table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Value</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inputInstances.map((input, index) => (
            <TableRow
              key={functionName + input.name + index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {input.name}
              </StyledTableCell>
              <StyledTableCell>{input.type.swayType}</StyledTableCell>
              <TableCell style={{ width: "100%" }}>
                <ParameterInput
                  input={input}
                  value={paramValues[index]}
                  onChange={(value: SimpleParamValue) =>
                    setParamAtIndex(index, value)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
