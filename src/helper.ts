import { PanResponseStatus } from "@digi-money/game";

export const validateResponse = ({ status, error }: any) => {
  if (status === PanResponseStatus.REJECT) {
    throw new Error("User reject request");
  }
  if (status === PanResponseStatus.FAILED) {
    throw new Error(error);
  }
};
