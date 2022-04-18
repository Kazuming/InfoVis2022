function AreaOfTriangle(v0, v1, v2)
{
    var a = new Vec3(v0.x-v1.x, v0.y-v1.y, v0.z-v1.z)
    var b = new Vec3(v0.x-v2.x, v0.y-v2.y, v0.z-v2.z)
    var S = 1/2*(((a.y*b.z-a.z*b.y)**2+(a.z*b.x-a.x*b.z)**2+(a.x*b.y-a.y*b.x)**2)**(1/2))
    return S
}