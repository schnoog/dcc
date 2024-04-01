function dumpairportdata()
    
    local airdromedump = {}
    for k, v in base.pairs(base.MapWindow.listAirdromes) do
        --MapWindow.listAirdromes[unit.boss.route.points[1].airdromeId].roadnet
        local sList = Terrain.getStandList(v.roadnet, {"SHELTER","FOR_HELICOPTERS","FOR_AIRPLANES","WIDTH","LENGTH","HEIGHT"})
        local airdrome = AirdromeData.getAirdrome(AirdromeData.getAirdromeId(k))
        info = {}
        info["id"] = airdrome.airdromeNumber
        info["name"] = airdrome.name
        info["airport"] = v
        info["standlist"] = sList
        info["frequencies"] = airdrome
        airdromedump[k] = info
    end

    --TODO dynamic path
    local airdromePath = "C:\\Users\\juerg\\Saved Games\\DCS.openbeta\\export\\airdromes.json"

    local f = base.io.open(airdromePath, 'w')
    local JSON = (base.loadfile "Scripts/JSON.lua")()	

    if f then
            f:write(JSON:encode(airdromedump))
            f:close()
    else
        showWarningMessageBox(_('Error saving standlist'))
    end
end

dumpairportdata()