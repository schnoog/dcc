local json = require 'json'

local logName = 'DCS.Lua.Exporter'
local function debugLog(message) log.write(logName, log.INFO, tostring(message)) end

local planesPath = lfs.writedir().."export\\planes.json"
local helicopersPath = lfs.writedir().."export\\helicopers.json"
local countriesPath = lfs.writedir().."export\\countries.json"
local groundUnitsPath = lfs.writedir().."export\\groundUnits.json"

local function printObj(obj, hierarchyLevel) 
    if (hierarchyLevel == nil) then
      hierarchyLevel = 0
    elseif (hierarchyLevel == 4) then
      return 0
    end
  
    local whitespace = ""
    for i=0,hierarchyLevel,1 do
      whitespace = whitespace .. "-"
    end

    debugLog(obj)
    if (type(obj) == "table") then
      for k,v in pairs(obj) do
        io.write(whitespace .. "-")
        if (type(v) == "table") then
          printObj(v, hierarchyLevel+1)
        else
          debugLog(v)
        end           
      end
    else
        debugLog(obj)
    end
  end

  
local function export(obj, path)
    local fp = io.open(path, 'w')
    if fp then
        fp:write(json:encode(obj))
        fp:close()
    end
end

local function export_aircrafts(aircrafts, path)
    local aircraftArray = {} 

    for i in pairs(aircrafts) do
        local plane = aircrafts[i]
        debugLog(plane.type)
        
        local aircraft_object = {
            ["name"] = plane.type,
            ["display_name"] = plane.DisplayName,
            ["chaff"] = 0,
            ["flare "] = 0,
            ["max_fuel"] = plane.MaxFuelWeight,
            ["max_height"] = plane.MaxHeight,
            ["max_speed"] = plane.MaxSpeed,
        }

        if plane.passivCounterm then
          aircraft_object["chaff"] = plane.passivCounterm.chaff.default
          aircraft_object["flare"] = plane.passivCounterm.flare.default
        end
        
        aircraftArray[#aircraftArray + 1] = aircraft_object
    end

    export(aircraftArray, path)
end

local function export_ground_units(units, path)
  local unitArray = {} 

  for i in pairs(units) do
      local unit = units[i]
      
      local unit_object = {
          ["name"] = unit.type,
          ["display_name"] = unit.DisplayName,
          ["category"] = unit.category,
          ["playerCanDrive"] = unit.enablePlayerCanDrive,
      }
      
      unitArray[#unitArray + 1] = unit_object
  end

  export(unitArray, path)
end

local function export_countries()
    local countryArray = {}
    local countries = db.Countries

    for i in pairs(countries) do
        local country = countries[i]

        local country_object = {
            ["id"] = country.WorldID,
            ["name"] = country.Name,
            ["short_name"] = country.ShortName
        }

        countryArray[#countryArray + 1] = country_object
    end

    export(countryArray, countriesPath)
end

debugLog("start export")
--printObj(db)
export_aircrafts(db.Units.Planes.Plane, planesPath)
export_aircrafts(db.Units.Helicopters.Helicopter, helicopersPath)
export_ground_units(db.Units.Cars.Car, groundUnitsPath)
export_countries()
debugLog("finished export")