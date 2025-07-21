// src/types/leaflet-routing-machine.d.ts
import * as L from "leaflet";

declare module "leaflet" {
namespace Routing {
function control(options: any): any;
class OSRMv1 {
constructor(options?: any);
}
}
}