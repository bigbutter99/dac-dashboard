export var EntityType;
(function (EntityType) {
    EntityType["Org"] = "org";
    EntityType["Project"] = "project";
    EntityType["Claim"] = "claim";
    EntityType["Document"] = "document";
    EntityType["Signal"] = "signal";
    EntityType["Draft"] = "draft";
})(EntityType || (EntityType = {}));
export var Stage;
(function (Stage) {
    Stage["Concept"] = "concept";
    Stage["Pilot"] = "pilot";
    Stage["Demo"] = "demo";
    Stage["CommercialPilot"] = "commercial_pilot";
    Stage["Commercial"] = "commercial";
})(Stage || (Stage = {}));
export var ProjectType;
(function (ProjectType) {
    ProjectType["Pilot"] = "pilot";
    ProjectType["Demo"] = "demo";
    ProjectType["Commercial"] = "commercial";
    ProjectType["Research"] = "research";
})(ProjectType || (ProjectType = {}));
export var RelationType;
(function (RelationType) {
    RelationType["Offtake"] = "offtake";
    RelationType["Storage"] = "storage";
    RelationType["Technology"] = "technology";
    RelationType["Investment"] = "investment";
    RelationType["Collaboration"] = "collaboration";
})(RelationType || (RelationType = {}));
export var Trust;
(function (Trust) {
    Trust["High"] = "high";
    Trust["Medium"] = "medium";
    Trust["Low"] = "low";
    Trust["Unknown"] = "unknown";
})(Trust || (Trust = {}));
export var RAG;
(function (RAG) {
    RAG["Green"] = "green";
    RAG["Amber"] = "amber";
    RAG["Red"] = "red";
})(RAG || (RAG = {}));
