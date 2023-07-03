package cn.lalaframework.nad;

import cn.lalaframework.nad.exceptions.NoHandlerMappingException;
import cn.lalaframework.nad.interfaces.NadResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.PostConstruct;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest(classes = TestApplication.class)
class NadApiControllerTest {
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private NadApiController nadApiController;

    @PostConstruct
    void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void defs() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders
                                .get("/nad/api/defs")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("@.routes").isArray())
                .andExpect(MockMvcResultMatchers.jsonPath("@.classes").isArray());
    }

    @Test
    void sameObject() {
        NadResult defs = nadApiController.getDefs();
        assertSame(defs, nadApiController.getDefs());
        nadApiController.initCache();
        assertSame(defs, nadApiController.getDefs());
    }

    @Test
    void construct() {
        NadApiController nad = new NadApiController();
        assertThrows(NoHandlerMappingException.class, nad::getDefs);
    }
}