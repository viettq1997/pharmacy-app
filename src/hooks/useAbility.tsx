import {
  AbilityBuilder,
  createMongoAbility,
  MongoQuery,
  PureAbility,
} from "@casl/ability"
import { useKeycloak } from "@react-keycloak/web"

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type CRUDAction = "create" | "read" | "update" | "delete" | "readOwn"

export type Subject =
  | "medicine"
  | "supplier"
  | "stockPurchase"
  | "employee"
  | "customer"
  | "saleTransaction"
  | "report"

type Ability = [CRUDAction, Subject]

const useAbility = () => {
  const { can, build } = new AbilityBuilder<PureAbility<Ability, MongoQuery>>(
    createMongoAbility
  )
  const { keycloak, initialized } = useKeycloak()

  if (!initialized || !keycloak.authenticated) return null

  const role =
    (keycloak.tokenParsed?.resource_access as any)["pharmacy-management-system"]
      ?.roles[0] === "ADMIN"
      ? Role.ADMIN
      : Role.USER

  if (role === Role.ADMIN)
    can(
      ["create", "read", "update", "delete"],
      [
        "customer",
        "employee",
        "medicine",
        "report",
        "saleTransaction",
        "stockPurchase",
        "supplier",
      ]
    )
  if (role === Role.USER) {
    can("read", "medicine")
    can("read", "customer")
    can("readOwn", "saleTransaction")
  }

  return build()
}

export default useAbility