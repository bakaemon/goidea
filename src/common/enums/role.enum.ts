enum Role {
    Admin = 'admin',
    QAM = "qam",
    QAC = "qac",
    Staff = "staff",
}

export const RoleNames = ["admin", "qam", "qac", "staff"]

export type RoleName = typeof RoleNames[number];

export default Role;