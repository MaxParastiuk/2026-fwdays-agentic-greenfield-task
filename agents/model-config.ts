import { getModelId as getSharedModelId } from "@/lib/model-config";

export function getMakerModelId(): string {
  return getSharedModelId();
}

export function getCheckerModelId(): string {
  return getSharedModelId();
}
