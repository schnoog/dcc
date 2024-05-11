Utils = {}

function Utils.distanceToPosition(sourcePoint, targetPoint) 
    local xSource = sourcePoint.x
    local xTarget = targetPoint.x
    local ySource = sourcePoint.y
    local yTarget = targetPoint.y

    local xDiff = xSource - xTarget
    local yDiff = ySource - yTarget

    return math.sqrt(xDiff * xDiff + yDiff * yDiff)
end

function Utils.getFlightGroup(groupName)
    for i in pairs(config.flightGroups) do
        local flightGroup = config.flightGroups[i]

        if flightGroup.name == groupName then
            return flightGroup
        end
    end
end

function Utils.sendMessageToUnits(text, unitNames, duration)
    local msg = {}
    msg.text = text

    if duration then
        msg.displayTime = duration
    else
        msg.displayTime = 5
    end
    msg.msgFor = {units = unitNames}
    mist.message.add(msg) 
end

function Utils.getPointAltitude(point)
    local altitudeMeters = land.getHeight({x = point.x, y = point.z})
    local altitudeFeet = math.floor(altitudeMeters * 3.28084)

    return altitudeFeet
end

function Utils.getFlightGroupUnitNames(groupConfig)
    local flightGroupUnitNames = {}

    local groupName = groupConfig.groupName
    local group = Group.getByName(groupName)

    if group then
        local units = group:getUnits()

        for i in pairs(units) do
            local unit = units[i]

            if unit ~= nil then
                flightGroupUnitNames[#flightGroupUnitNames + 1] = unit:getName()
            end
        end

        return flightGroupUnitNames
    end
end